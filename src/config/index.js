import errorImg from '@/images/common/noPic.png';
const SERVER_NAME = 'http://203.195.171.224:8188';
const IMG_PATH = `${SERVER_NAME}/publicPlatform/image/read?imageKey=`;

const errorImgFunc='this.src="'+errorImg+'"';
export {
    SERVER_NAME,
    IMG_PATH,
    errorImgFunc
}