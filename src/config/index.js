import { institutionType } from '../utils/constants';
import { dsProd, dsDev } from './ds-config';

let config;

if (process.env.REACT_APP_STAGE === 'PROD') {
    switch (institutionType) {
        case 'ds':
            config = dsProd;
            break;
        default:
            config = dsProd;
            break;
    }
} else {
    switch (institutionType) {
        case 'ds':
            config = dsDev;
            break;
        default:
            config = dsDev;
            break;
    }
}

export default config;