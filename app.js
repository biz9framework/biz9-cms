/* --- APP REQUIRE START -- */
async=require("async");
compression = require('compression')
busboy=require("busboy");
cors=require("cors")
detect=require('detect-file-type');
express=require("express");
fs=require('fs-extra')
mp3Duration=require('mp3-duration');
path=require("path");
session=require("express-session");
biz9_app_config=require("./biz9_app_config");
/* --- APP REQUIRE END --- */
/* --- APP DEFAULT START --- */
ENV=process.env.NODE_ENV;
APP_ENV=biz9_app_config.APP_ENV;
/*--- APP DEFAULT END ---*/
/* --- APP CONFIG START  --- */
BIZ9_CMS_VERSION='7.3.8'
APP_VERSION='1.0.2'
PROJECT_ID=biz9_app_config.PROJECT_ID;
APP_TITLE_ID=biz9_app_config.APP_TITLE_ID;
APP_TITLE=biz9_app_config.APP_TITLE_ID;
APP_PORT=biz9_app_config.APP_PORT;
/* --- APP CONFIG END  --- */
/* --- MONGO START --- */
MONGO_IP=biz9_app_config.MONGO_IP;
MONGO_PORT=biz9_app_config.MONGO_PORT;
MONGO_URL=biz9_app_config.MONGO_URL;
/* --- MONGO END --- */
/* --- ENV AWS START --- */
AWS_S3_SAVE=biz9_app_config.AWS_S3_SAVE;
AWS_S3_BUCKET=biz9_app_config.AWS_S3_BUCKET;
AWS_KEY=biz9_app_config.AWS_KEY;
AWS_SECRET=biz9_app_config.AWS_SECRET;
AWS_REGION=biz9_app_config.AWS_REGION;
/* --- ENV AWS END --- */
/* --- EMAILZ START --- */
EMAIL_TO=biz9_app_config.EMAIL_TO;
EMAIL_FROM=biz9_app_config.EMAIL_FROM;
/* --- EMAILZ START --- */
/* --- ENV FILE START --- */
FILE_SAVE_PATH=biz9_app_config.FILE_SAVE_PATH;
FILE_URL=biz9_app_config.FILE_URL;
/* --- ENV FILE END --- */
//-BREVO-START
BREVO_KEY=biz9_app_config.BREVO_KEY;
BREVO_ORDER_SEND_TEMPLATE_ID=biz9_app_config.BREVO_ORDER_SEND_TEMPLATE_ID;
BREVO_FORM_SEND_TEMPLATE_ID=biz9_app_config.BREVO_FORM_SEND_TEMPLATE_ID;
//-BREVO-END
//-FIREBASE-START
FIREBASE_TOPIC_MOBILE_ALL=biz9_app_config.FIREBASE_TOPIC_MOBILE_ALL;
FIREBASE_TOPIC_MOBILE_GUEST=biz9_app_config.FIREBASE_TOPIC_MOBILE_GUEST;
FIREBASE_TOPIC_MOBILE_ADMIN=biz9_app_config.FIREBASE_TOPIC_MOBILE_ADMIN;
FIREBASE_KEY_FILE=biz9_app_config.FIREBASE_KEY_FILE;
//-FIREBASE-END
//-STAT-START
STAT_VIEW_ID='1';
STAT_LIKE_ID='2';
STAT_POST_ID='3';
//-STAT-END
/* --- DATA_TYPE-START --- */
DT_BLANK='blank_biz';
DT_ITEM_MAP='item_map_biz';
DT_ITEM='item_biz';
DT_PHOTO='photo_biz';
DT_USER='user_biz';
DT_CUSTOMER='customer_biz';
DT_MEMBER='member_biz';
DT_BLOG_POST='blog_post_biz';
DT_CATEGORY='category_biz';
DT_REVIEW='review_biz';
DT_EVENT='event_biz';
DT_GALLERY='gallery_biz';
DT_VIDEO='video_biz';
DT_PRODUCT='product_biz';
DT_CART_ITEM="cart_item_biz";
DT_ORDER="order_biz";
DT_ORDER_ITEM="order_item_biz";
DT_SERVICE='service_biz';
DT_PROJECT='project_biz';
DT_CONTACT='contact_biz';
/* --- DATA_TYPE-END --- */
/* --- BiZ9_CORE_CONFIG-START --- */
data_config={
    mongo_server_user:biz9_app_config.MONGO_SERVER_USER,
    mongo_username_password:biz9_app_config.MONGO_USERNAME_PASSWORD,
    mongo_ip:biz9_app_config.MONGO_IP,
    mongo_port:biz9_app_config.MONGO_PORT,
    mongo_config:biz9_app_config.MONGO_CONFIG,
    ssh_key:biz9_app_config.SSH_KEY,
    redis_url:biz9_app_config.REDIS_URL,
    redis_port:biz9_app_config.REDIS_PORT,
};
app_config={
    app_title_id:biz9_app_config.APP_TITLE_ID,
    app_version:APP_VERSION,
    app_title:biz9_app_config.APP_TITLE,
    project_id:biz9_app_config.PROJECT_ID,
    file_url:biz9_app_config.FILE_URL,
    biz_map:biz9_app_config.BIZ_MAP
}
/* --- BIZ9 CONFIG START --- */
biz9=require("biz9-core")(app_config,data_config);
//biz9=require("/home/mama/www/doqbox/biz9/biz9-core/src/unstable")(app_config,data_config);
/* --- BiZ9_CORE_CONFIG-END --- */
/* --- PHOTO-SIZE-START --- */
PHOTO_SIZE_ALBUM={title_url:"",size:0};
PHOTO_SIZE_THUMB={title_url:"thumb_size_",size:250};
PHOTO_SIZE_MID={title_url:"mid_size_",size:720};
PHOTO_SIZE_LARGE={title_url:"large_size_",size:1000};
PHOTO_SIZE_SQUARE_THUMB={title_url:"square_thumb_size_",size:250};
PHOTO_SIZE_SQUARE_MID={title_url:"square_mid_size_",size:720};
PHOTO_SIZE_SQUARE_LARGE={title_url:"square_large_size_",size:1000};
/* --- PHOTO-SIZE-END --- */
/* --- APP URL START  -- */
test=require('./routes/cloud/test');
crud=require('./routes/cloud/crud');
mail=require('./routes/cloud/mail');
file=require('./routes/cloud/file');
index=require('./routes/index');
item_map=require('./routes/item_map');
product=require('./routes/product');
category=require('./routes/category');
service=require('./routes/service');
event=require('./routes/event');
customer=require('./routes/customer');
contact=require('./routes/contact');
user=require('./routes/user');
blog_post=require('./routes/blog_post');
item=require('./routes/item');
project=require('./routes/project');
member=require('./routes/member');
gallery=require('./routes/gallery');
video=require('./routes/video');
review=require('./routes/review');
order=require('./routes/order');
store=require('./routes/store');
/* --- APP URL END  -- */
/* --- APP EXPRESS START --- */
var app = express();
app.use(cors());
app.use(compression());
app.use(session({
    secret: "secret_key_cms",
    cookieName: "session_cms",
    secret: "eg[isfd-8yF9-7w2315df{}+Ijsli;;to8",
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    saveUninitialized: false,
    resave:false
}));
app.use(compression())
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({limit: "50mb",extended:false}));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
/* --- APP EXPRESS END --- */
/* --- APP ROUTES START --- */
app.use('/cloud/crud',crud);
app.use('/cloud/mail',mail);
app.use('/cloud/file',file);
app.use('/cloud/test',test);
app.use('/', index);
app.use('/item_map',item_map);
app.use('/item',item);
app.use('/user',user);
app.use('/customer',customer);
app.use('/contact',contact);
app.use('/blog_post',blog_post);
app.use('/project',project);
app.use('/member',member);
app.use('/gallery',gallery);
app.use('/video',video);
app.use('/review',review);
app.use('/order',order);
app.use('/product',product);
app.use('/category',category);
app.use('/service',service);
app.use('/event',event);
app.use('/store',store);
/* --- APP ROUTES END --- */
/* --- APP ERROR START --- */
app.use(function(err, req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header("Access-Control-Allow-Headers", "x-openrtb-version,Content-Type,*");
	res.header("X-Frame-Options", "ALLOWALL");
    res.locals.message = err.message;
    res.locals.error =  err;
    res.status(err.status || 500);
    res.render("error");
});
/* --- APP ERROR END --- */
module.exports = app;
