/* --- APP CONFIG START  --- */
const PROJECT_ID='19';
const APP_TITLE_ID='mobile-19';
//const APP_TITLE_ID='mobile-266';
const APP_TITLE='BiZ9-CMS';
const APP_PORT="1902";
const APP_CLOUD_BUCKET='mkprod';
/* --- APP CONFIG END  --- */
/* --- ENV FILE START --- */
const FILE_SAVE_PATH=__dirname+"/public/uploads/";//prod
//const FILE_URL="http://localhost:1901/uploads/"; //prod
//const FILE_URL="/uploads/"; //prod
const FILE_URL="https://"+APP_CLOUD_BUCKET+".s3.amazonaws.com/" //aws_s3_url
/* --- ENV FILE END --- */
/* --- BIZ9 CONFIG START --- */
const BIZ_MAP=true;
/* --- BIZ9 CONFIG END --- */
/* --- EMAILZ START --- */
const EMAIL_SENDER="notifications@bossappz.com";
const EMAIL_REPLY="notifications@bossappz.net";
/* --- EMAILZ START --- */
/* --- MONGO START --- */
//const MONGO_IP=process.env.BIZ9_BOX_IP_217;
const MONGO_IP='localhost';  // OS_ENV = process.env.BIZ9_BOX_IP_217; local = 'localhost'; ip_address = '0.0.0.0'
const MONGO_USERNAME_PASSWORD=''; // local = ''; remote = 'ban:1234567@'
const MONGO_PORT="27019";
const MONGO_SERVER_USER='admin';
const MONGO_CONFIG='/etc/mongod.conf';
const SSH_KEY="";
/* --- MONGO END --- */
/* --- REDIS START --- */
const REDIS_URL="0.0.0.0";
const REDIS_PORT="27019";
/* --- REDIS END --- */
/* --- ENV AWS START --- */
const AWS_S3_SAVE=true;
const AWS_S3_BUCKET=APP_CLOUD_BUCKET;
const AWS_KEY="";
const AWS_SECRET="";
const AWS_REGION='us-east-1';//prod
/* --- ENV AWS END --- */
/* --- BREVO-START --- */
const BREVO_KEY="";
const BREVO_FORM_SEND_SUBJECT ='Form Message Send';
const BREVO_ORDER_SEND_TEMPLATE_ID='7';
const BREVO_FORM_SEND_TEMPLATE_ID='10';
/* --- BREVO-END --- */
/* --- FIREBASE-START --- */
const FIREBASE_TOPIC_MOBILE_ALL='/topics/mobile_all';
const FIREBASE_TOPIC_MOBILE_GUEST='/topics/mobile_guest';
const FIREBASE_TOPIC_MOBILE_ADMIN='/topics/mobile_admin';
const FIREBASE_KEY_FILE=__dirname+"/keys/firebase/";
/* --- FIREBASE-END --- */
exports.BREVO_KEY = BREVO_KEY;
exports.BREVO_FORM_SEND_SUBJECT = BREVO_FORM_SEND_SUBJECT;
exports.BREVO_FORM_SEND_TEMPLATE_ID = BREVO_FORM_SEND_TEMPLATE_ID;
exports.FIREBASE_TOPIC_MOBILE_ALL = FIREBASE_TOPIC_MOBILE_ALL;
exports.FIREBASE_TOPIC_MOBILE_GUEST = FIREBASE_TOPIC_MOBILE_GUEST;
exports.FIREBASE_TOPIC_MOBILE_ADMIN = FIREBASE_TOPIC_MOBILE_ADMIN;
exports.FIREBASE_KEY_FILE = FIREBASE_KEY_FILE;
exports.PROJECT_ID = PROJECT_ID;
exports.APP_TITLE_ID = APP_TITLE_ID;
exports.APP_TITLE = APP_TITLE;
exports.APP_PORT = APP_PORT;
exports.MONGO_USERNAME_PASSWORD = MONGO_USERNAME_PASSWORD;
exports.MONGO_PORT = MONGO_PORT;
exports.MONGO_IP = MONGO_IP;
exports.MONGO_SERVER_USER = MONGO_SERVER_USER;
exports.MONGO_CONFIG = MONGO_CONFIG;
exports.SSH_KEY = SSH_KEY;
exports.REDIS_URL = REDIS_URL;
exports.REDIS_PORT = REDIS_PORT;
exports.AWS_S3_SAVE = AWS_S3_SAVE;
exports.AWS_S3_BUCKET = AWS_S3_BUCKET;
exports.AWS_KEY = AWS_KEY;
exports.AWS_SECRET = AWS_SECRET;
exports.AWS_REGION = AWS_REGION;
exports.EMAIL_SENDER = EMAIL_SENDER;
exports.EMAIL_REPLY = EMAIL_REPLY;
exports.FILE_SAVE_PATH = FILE_SAVE_PATH;
exports.FILE_URL = FILE_URL;
exports.BIZ_MAP = BIZ_MAP;
