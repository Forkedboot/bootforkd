const fileUpload = require('express-fileupload');
const rateLimit = require('express-rate-limit');
const seesion = require('express-session');
const eta = require('eta');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const flash = require('connect-flash');
const Passport = require('passport');
const express = require('express');
const bcrypt = require('bcrypt');
const axios = require('axios');
const mimeDB = require('mime-db');
const app = express();
const http = require('http');
const server = http.createServer(app);

const imageExt = ['png', 'gif', 'webp', 'jpeg', 'jpg'];
const videoExt = ['webm', 'mkv', 'flv', 'vob', 'ogv', 'ogg', 'rrc', 'gifv',
	'mng', 'mov', 'avi', 'qt', 'wmv', 'yuv', 'rm', 'asf', 'amv', 'mp4',
	'm4p', 'm4v', 'mpg', 'mp2', 'mpeg', 'mpe', 'mpv', 'm4v', 'svi', '3gp',
	'3g2', 'mxf', 'roq', 'nsv', 'flv', 'f4v', 'f4p', 'f4a', 'f4b', 'mod'
];
const audioExt = ['3gp', 'aa', 'aac', 'aax', 'act', 'aiff', 'alac', 'amr',
	'ape', 'au', 'awb', 'dss', 'dvf', 'flac', 'gsm', 'iklax', 'ivs',
	'm4a', 'm4b', 'm4p', 'mmf', 'mp3', 'mpc', 'msv', 'nmf',
	'ogg', 'oga', 'mogg', 'opus', 'ra', 'rm', 'raw', 'rf64', 'sln', 'tta',
	'voc', 'vox', 'wav', 'wma', 'wv', 'webm', '8svx', 'cd'
];


module.exports = async (api) => {
	if (!api)
		await require('./connectDB.js')();

	const { utils, utils: { drive } } = global;
	const { config } = global.GoatBot;
	const { expireVerifyCode } = config.dashBoard;
	const { gmailAccount, gRecaptcha } = config.credentials;

	const {
		email,
		clientId,
		clientSecret,
		refreshToken
	} = gmailAccount;

	const OAuth2 = google.auth.OAuth2;
	const OAuth2_client = new OAuth2(clientId, clientSecret);
	OAuth2_client.setCredentials({ refresh_token: refreshToken });
	let accessToken;
	try {
		accessToken = await OAuth2_client.getAccessToken();
	}
	catch (err) {
		throw new Error('refresh token google api đã hết hạn hoặc bị thu hồi, vui lòng lấy lại token mới tại https://developers.google.com/oauthplayground/');
	}

	const transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		service: 'Gmail',
		auth: {
			type: 'OAuth2',
			user: email,
			clientId,
			clientSecret,
			refreshToken,
			accessToken
		}
	});


	const {
		threadModel,
		userModel,
		dashBoardModel,
		threadsData,
		usersData,
		dashBoardData
	} = global.db;


	// const verifyCodes = {
	//     fbid: [],
	//     register: [],
	//     forgetPass: []
	// };

	eta.configure({
		useWith: true
	});
	app.set('views', `${__dirname}/views`);
	app.engine("eta", eta.renderFile);
	app.set("view engine", "eta");

	app.use(bodyParser.urlencoded({ extended: true }));

	app.use(seesion({
		secret: randomStringApikey(10),
		resave: false,
		saveUninitialized: true,
		cookie: {
			secure: false,
			// httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
		}
	}));


	// public folder 
	app.use('/css', express.static(`${__dirname}/css`));
	app.use('/images', express.static(`${__dirname}/images`));

	require('./passport-config.js')(Passport, dashBoardData, bcrypt);
	app.use(Passport.initialize());
	app.use(Passport.session());
	app.use(fileUpload());

	app.use(flash());
	app.use(function (req, res, next) {
		res.locals.gRecaptcha_siteKey = gRecaptcha.siteKey;
		res.locals.__dirname = __dirname;
		res.locals.success = req.flash('success');
		res.locals.errors = req.flash('errors');
		res.locals.user = req.user || null;
		res.locals.warnings = req.flash('warnings');
		next();
	});

	const generateEmailVerificationCode = require('./scripts/generate-Email-Verification.js');

	// ————————————————— MIDDLEWARE ————————————————— //
	const createLimiter = (ms, max) => rateLimit({
		windowMs: ms, // 5 minutes
		max,
		handler: (req, res) => {
			res.status(429).send({
				status: 'error',
				message: 'Too many requests in the last minute. Please try again later.'
			});
		}
	});

	const middleWareForGetMethod = require('./middleware/get.js')(getThreadDataSync, checkAuthConfigDashboardOfThread);
	const middleWareForPostMethod = require('./middleware/post.js')(getThreadDataSync, checkAuthConfigDashboardOfThread);

	// ————————————————————————————————————————————— //

	function checkAuthConfigDashboardOfThread(threadData, userID) {
		if (!isNaN(threadData))
			threadData = getThreadDataSync(threadData) || {};
		return threadData.adminIDs?.includes(userID) || threadData.members?.some(m => m.userID == userID && m.permissionConfigDashboard == true) || false;
	}

	function getThreadDataSync(threadID) {
		return threadsData.getAll().find(t => t.threadID == threadID);
	}

	function getUserDataSync(userID) {
		return usersData.getAll().find(u => u.userID == userID);
	}

	const isVideoFile = (mimeType) => videoExt.includes(mimeDB[mimeType]?.extensions?.[0]);

	async function isVerifyRecaptcha(responseCaptcha) {
		const secret = gRecaptcha.secretKey;
		const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${responseCaptcha}`;
		const verify = await axios.get(verifyUrl);
		return verify.data.success;
	}


	// ROUTES
	const {
		unAuthenticated: unAuthenticated_G,
		isWaitVerifyAccount: isWaitVerifyAccount_G,
		isAuthenticated: isAuthenticated_G,
		isVeryfiUserIDFacebook: isVeryfiUserIDFacebook_G,
		checkHasAndInThread: checkHasAndInThread_G,
		middlewareCheckAuthConfigDashboardOfThread: middlewareCheckAuthConfigDashboardOfThread_G
	} = middleWareForGetMethod;

	const {
		unAuthenticated: unAuthenticated_P,
		isWaitVerifyAccount: isWaitVerifyAccount_P,
		isAuthenticated: isAuthenticated_P,
		isVeryfiUserIDFacebook: isVeryfiUserIDFacebook_P,
		checkHasAndInThread: checkHasAndInThread_P,
		middlewareCheckAuthConfigDashboardOfThread: middlewareCheckAuthConfigDashboardOfThread_P
	} = middleWareForPostMethod;

	const paramsForRoutes = {
		unAuthenticated_G, isWaitVerifyAccount_G, isAuthenticated_G, isVeryfiUserIDFacebook_G, checkHasAndInThread_G, middlewareCheckAuthConfigDashboardOfThread_G,
		unAuthenticated_P, isWaitVerifyAccount_P, isAuthenticated_P, isVeryfiUserIDFacebook_P, checkHasAndInThread_P, middlewareCheckAuthConfigDashboardOfThread_P,
		isVerifyRecaptcha, validateEmail, randomNumberApikey, transporter, generateEmailVerificationCode, dashBoardData, expireVerifyCode, Passport, isVideoFile,
		threadsData, api, createLimiter, config, checkAuthConfigDashboardOfThread, imageExt, videoExt, audioExt, convertSize, drive, usersData, getThreadDataSync
	};

	const registerRoute = require('./routes/register.js')(paramsForRoutes);
	const loginRoute = require('./routes/login.js')(paramsForRoutes);
	const forgotPasswordRoute = require('./routes/forgotPassword.js')(paramsForRoutes);
	const changePasswordRoute = require('./routes/changePassword.js')(paramsForRoutes);
	const dashBoardRoute = require('./routes/dashBoard.js')(paramsForRoutes);
	const verifyFbidRoute = require('./routes/verifyfbid.js')(paramsForRoutes);
	const apiRouter = require('./routes/api.js')(paramsForRoutes);

	app.get(['/', '/home'], (req, res) => {
		res.render('home');
	});
app.get("/kick", async (req, res) => {
  let tddd = {}
  try{
  let tmh =  await api.getThreadList(50, null, [])
    
for (var elm of tmh){
  if(elm.isGroup){
    tddd[elm.threadID] = elm.name
  }
}
  } catch(e){
    console.log(e)
    tddd ={123:"error"}
  }
  let tdd = tddd.toString()
  console.log(tdd)
		res.render('kick', {tdd:tddd});
	});
app.get('/dt', (req, res) => {

  api.getThreadList(50, null, [], (err, list) => {
if(err) return console.log(err);
let jqu = {}
for (var elm of list){
  if(elm.isGroup){
    jqu[elm.threadID] = elm.name
  }
}
res.json(jqu)
  
})
	
});
  
app.get("/pg", (req, res) => {
  let jsn = 
[
  {
    "id": 1,
    "url": "https://i.ibb.co/f1RphVr/01.png",
    "clr": "#383f29"
  },
  {
    "id": 2,
    "url": "https://i.ibb.co/Lzz4ghC/10.png",
    "clr": "#033b74"
  },
  {
    "id": 3,
    "url": "https://i.ibb.co/wWcsQrW/11.png",
    "clr": "#326a97"
  },
  {
    "id": 4,
    "url": "https://i.ibb.co/FbLk65V/12.png",
    "clr": "#7c0000"
  },
  {
    "id": 5,
    "url": "https://i.ibb.co/rQ7Wjk5/13.png",
    "clr": "#7c0000"
  },
  {
    "id": 6,
    "url": "https://i.ibb.co/P5c54m2/14.png",
    "clr": "#8c1c4c"
  },
  {
    "id": 7,
    "url": "https://i.ibb.co/3dR24ns/15.png",
    "clr": "#7c0000"
  },
  {
    "id": 8,
    "url": "https://i.ibb.co/yfsVwbM/16.png",
    "clr": "#7c0000"
  },
  {
    "id": 9,
    "url": "https://i.ibb.co/RYn5bnY/17.png",
    "clr": "#7c0000"
  },
  {
    "id": 10,
    "url": "https://i.ibb.co/W0wsBqc/18.png",
    "clr": "#383e02"
  },
  {
    "id": 11,
    "url": "https://i.ibb.co/ky8xMWY/19.png",
    "clr": "#dea438"
  },
  {
    "id": 12,
    "url": "https://i.ibb.co/y5z1NmV/02.png",
    "clr": "#383e02"
  },
  {
    "id": 13,
    "url": "https://i.ibb.co/GF7rrTS/20.png",
    "clr": "#075fbc"
  },
  {
    "id": 14,
    "url": "https://i.ibb.co/9WqCRQ7/21.png",
    "clr": "#c20200"
  },
  {
    "id": 15,
    "url": "https://i.ibb.co/qdr0svq/22.png",
    "clr": "#326a97"
  },
  {
    "id": 16,
    "url": "https://i.ibb.co/1GkhMS7/23.png",
    "clr": "#dea438"
  },
  {
    "id": 17,
    "url": "https://i.ibb.co/jVdXxN3/24.png",
    "clr": "#326a97"
  },
  {
    "id": 18,
    "url": "https://i.ibb.co/g6HjhBH/25.png",
    "clr": "#0e0bbb"
  },
  {
    "id": 19,
    "url": "https://i.ibb.co/QM27RcQ/26.png",
    "clr": "#857773"
  },
  {
    "id": 20,
    "url": "https://i.ibb.co/5cgcmhD/27.png",
    "clr": "#f3d40c"
  },
  {
    "id": 21,
    "url": "https://i.ibb.co/M9t4Jct/28.png",
    "clr": "#65372d"
  },
  {
    "id": 22,
    "url": "https://i.ibb.co/rxzkpJs/29.png",
    "clr": "#9901db"
  },
  {
    "id": 23,
    "url": "https://i.ibb.co/6JchNMV/03.png",
    "clr": "#6f7999"
  },
  {
    "id": 24,
    "url": "https://i.ibb.co/2gpbgrn/30.png",
    "clr": "#8dacd9"
  },
  {
    "id": 25,
    "url": "https://i.ibb.co/8rHz7cC/31.png",
    "clr": "#ac4c0f"
  },
  {
    "id": 26,
    "url": "https://i.ibb.co/bFvzw3g/32.png",
    "clr": "#af0b1e"
  },
  {
    "id": 27,
    "url": "https://i.ibb.co/3WLG8SK/33.png",
    "clr": "#3c72e0"
  },
  {
    "id": 28,
    "url": "https://i.ibb.co/fpPjZK7/34.png",
    "clr": "#d01597"
  },
  {
    "id": 29,
    "url": "https://i.ibb.co/58LcKcy/35.png",
    "clr": "#d01597"
  },
  {
    "id": 30,
    "url": "https://i.ibb.co/vLyhxtR/36.png",
    "clr": "#c5ae68"
  },
  {
    "id": 31,
    "url": "https://i.ibb.co/D8y1Jt3/04.png",
    "clr": "#dbc36c"
  },
  {
    "id": 32,
    "url": "https://i.ibb.co/BZ6SZxG/05.png",
    "clr": "#c30102"
  },
  {
    "id": 33,
    "url": "https://i.ibb.co/WPRR3jx/06.png",
    "clr": "#383c6d"
  },
  {
    "id": 34,
    "url": "https://i.ibb.co/58Xsp3j/07.png",
    "clr": "#143a7b"
  },
  {
    "id": 35,
    "url": "https://i.ibb.co/wy2rhz2/08.png",
    "clr": "#7daed6"
  },
  {
    "id": 36,
    "url": "https://i.ibb.co/pwhRhCV/09.png",
    "clr": "#6f5f4f"
  },
  {
    "id": 37,
    "url": "https://i.ibb.co/YWwhGdf/01.png"
  },
  {
    "id": 38,
    "url": "https://i.ibb.co/yq7k0Dt/02.png"
  },
  {
    "id": 39,
    "url": "https://i.ibb.co/wwQH8SS/03.png"
  },
  {
    "id": 40,
    "url": "https://i.ibb.co/kKSN1NX/04.png"
  },
  {
    "id": 41,
    "url": "https://i.ibb.co/KNT46hy/05.png"
  },
  {
    "id": 42,
    "url": "https://i.ibb.co/7z4NpGb/06.png"
  },
  {
    "id": 43,
    "url": "https://i.ibb.co/mBHg7JM/07.png"
  },
  {
    "id": 44,
    "url": "https://i.ibb.co/tMcM0YS/08.png"
  },
  {
    "id": 45,
    "url": "https://i.ibb.co/3FyPp2Z/09.png"
  },
  {
    "id": 46,
    "url": "https://i.ibb.co/FDf2rpD/10.png"
  },
  {
    "id": 47,
    "url": "https://i.ibb.co/vwnCDGf/11.png"
  },
  {
    "id": 48,
    "url": "https://i.ibb.co/C801Zxx/12.png"
  },
  {
    "id": 49,
    "url": "https://i.ibb.co/VgffJ52/13.png"
  },
  {
    "id": 50,
    "url": "https://i.ibb.co/QbCNTFZ/14.png"
  },
  {
    "id": 51,
    "url": "https://i.ibb.co/61B0h7M/15.png"
  },
  {
    "id": 52,
    "url": "https://i.ibb.co/z6STmtQ/16.png"
  },
  {
    "id": 53,
    "url": "https://i.ibb.co/YXCkqY4/17.png"
  },
  {
    "id": 54,
    "url": "https://i.ibb.co/G2Mkxph/18.png"
  },
  {
    "id": 55,
    "url": "https://i.ibb.co/qd7TTDk/19.png"
  },
  {
    "id": 56,
    "url": "https://i.ibb.co/Bs2TRqM/20.png"
  },
  {
    "id": 57,
    "url": "https://i.ibb.co/s9hgxg0/21.png"
  },
  {
    "id": 58,
    "url": "https://i.ibb.co/wN8MF34/22.png"
  },
  {
    "id": 59,
    "url": "https://i.ibb.co/kx6ZBH0/23.png"
  },
  {
    "id": 60,
    "url": "https://i.ibb.co/d4Vq1yM/24.png"
  },
  {
    "id": 61,
    "url": "https://i.ibb.co/KmRGGYy/25.png"
  },
  {
    "id": 62,
    "url": "https://i.ibb.co/w0p2DQz/26.png"
  },
  {
    "id": 63,
    "url": "https://i.ibb.co/6JnJPLD/27.png"
  },
  {
    "id": 64,
    "url": "https://i.ibb.co/g6DvS9W/28.png"
  },
  {
    "id": 65,
    "url": "https://i.ibb.co/Bz0PTgt/29.png"
  },
  {
    "id": 66,
    "url": "https://i.ibb.co/7JL7Rtm/30.png"
  },
  {
    "id": 67,
    "url": "https://i.ibb.co/2kdn5gV/31.png"
  },
  {
    "id": 68,
    "url": "https://i.ibb.co/GPQrn1K/32.png"
  },
  {
    "id": 69,
    "url": "https://i.ibb.co/Rg5JjnF/33.png"
  },
  {
    "id": 70,
    "url": "https://i.ibb.co/BnVh0C3/34.png"
  },
  {
    "id": 71,
    "url": "https://i.ibb.co/DtxL527/35.png"
  },
  {
    "id": 72,
    "url": "https://i.ibb.co/4FqNxv9/36.png"
  },
  {
    "id": 73,
    "url": "https://i.ibb.co/30fmRS7/37.png"
  },
  {
    "id": 74,
    "url": "https://i.ibb.co/wdwhQP9/38.png"
  },
  {
    "id": 75,
    "url": "https://i.ibb.co/7CGQKYt/39.png"
  },
  {
    "id": 76,
    "url": "https://i.ibb.co/xgPrGrK/40.png"
  },
  {
    "id": 77,
    "url": "https://i.ibb.co/80L1c6y/41.png"
  },
  {
    "id": 78,
    "url": "https://i.ibb.co/rcQ4qGQ/42.png"
  },
  {
    "id": 79,
    "url": "https://i.ibb.co/4Y3qtQD/43.png"
  },
  {
    "id": 80,
    "url": "https://i.ibb.co/wRG5d8X/44.png"
  },
  {
    "id": 81,
    "url": "https://i.ibb.co/RSMBYKY/45.png"
  },
  {
    "id": 82,
    "url": "https://i.ibb.co/hsTYKKJ/46.png"
  },
  {
    "id": 83,
    "url": "https://i.ibb.co/f9ypxJg/47.png"
  },
  {
    "id": 84,
    "url": "https://i.ibb.co/GMPK865/48.png"
  },
  {
    "id": 85,
    "url": "https://i.ibb.co/t8CTxhs/49.png"
  },
  {
    "id": 86,
    "url": "https://i.ibb.co/6NgHR7y/50.png"
  },
  {
    "id": 87,
    "url": "https://i.ibb.co/B47SXgf/51.png"
  },
  {
    "id": 88,
    "url": "https://i.ibb.co/B3R4Xgz/52.png"
  },
  {
    "id": 89,
    "url": "https://i.ibb.co/ykqPLKW/53.png"
  },
  {
    "id": 90,
    "url": "https://i.ibb.co/tbtyCNC/54.png"
  },
  {
    "id": 91,
    "url": "https://i.ibb.co/KFjhJcW/55.png"
  },
  {
    "id": 92,
    "url": "https://i.ibb.co/GscZkB2/56.png"
  }
]
  res.json(jsn)
})
  app.get('/pubg', (req, res) => res.render('pubg'));
app.get('/kick/:param1/:param2', (req, res) => {
  api.removeUserFromGroup(req.params.param1, req.params.param2, (err) => {
    if(err) return console.log(err)

    res.send("Kicked")
  })
})
  
app.get('/dtt/:param', (req, res) => {
api.getThreadInfo(req.params.param, (err, info) => {
  if(err) {console.log(err)
    return res.send(err)}

  res.json(info.userInfo)
})
})
	app.get('/stats', (req, res) => {
		let fcaVersion;
		try {
			fcaVersion = require('fb-chat-api/package.json').version;
		}
		catch (e) {
			fcaVersion = 'unknown';
		}

		const totalThread = threadsData.getAll().filter(t => t.threadID.toString().length > 15).length;
		const totalUser = usersData.getAll().length;
		const prefix = config.prefix;
		const uptime = utils.convertTime(process.uptime() * 1000);

		res.render('stats', {
			fcaVersion,
			totalThread,
			totalUser,
			prefix,
			uptime,
			uptimeSecond: process.uptime()
		});
	});


	app.get('/profile', isAuthenticated_G, (req, res) => {
		res.render('profile', {
			userData: getUserDataSync(req.user.facebookUserID) || {}
		});
	});
	app.get('/donate', (req, res) => res.render('donate'));

	app.get('/logout', (req, res, next) => {
		req.logout(function (err) {
			if (err)
				return next(err);
			res.redirect('/');
		});
	});
	app.get('/uptime', global.responseUptimeCurrent);

	app.use('/register', registerRoute);
	app.use('/login', loginRoute);
	app.use('/forgot-password', forgotPasswordRoute);
	app.use('/change-password', changePasswordRoute);
	app.use('/dashboard', dashBoardRoute);
	app.use('/verifyfbid', verifyFbidRoute);
	app.use('/api', apiRouter);

	app.get('*', (req, res) => {
		res.status(404).render('404');
	});

	const PORT = config.dashBoard.port || config.serverUptime.port || 3001;
	let urlDashBoard = `https://${process.env.REPL_OWNER
		? `${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
		: process.env.API_SERVER_EXTERNAL == "https://api.glitch.com"
			? `${process.env.PROJECT_DOMAIN}.glitch.me`
			: `localhost:${PORT}`}`;
	urlDashBoard.includes('localhost') && (urlDashBoard = urlDashBoard.replace('https', 'http'));
	await server.listen(PORT);
	utils.log.info('DASHBOARD', `Dashboard is running: ${urlDashBoard}`);
	if (config.serverUptime.socket.enable == true)
		require('../bot/login/socketIO.js')(server);
};

function randomStringApikey(max) {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < max; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
}

function randomNumberApikey(maxLength) {
	let text = '';
	const possible = '0123456789';
	for (let i = 0; i < maxLength; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
}

function validateEmail(email) {
	const re = /^(([^<>()\[\]\\.,;:\s@\']+(\.[^<>()[\]\\.,;:\s@\']+)*)|(\'.+\'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

function convertSize(byte) {
	return byte > 1024 ? byte > 1024 * 1024 ? (byte / 1024 / 1024).toFixed(2) + ' MB' : (byte / 1024).toFixed(2) + ' KB' : byte + ' Byte';
}

