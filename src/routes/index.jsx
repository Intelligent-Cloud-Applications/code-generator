// Local
import { institutionType } from "../utils/constants";
import DSRoutes from './ds-routes';


// Code
let RoutesContainer;

switch (institutionType) {
    case 'ds':
        RoutesContainer = DSRoutes;
        break;
    default:
        RoutesContainer = DSRoutes;
        break;
}

export default RoutesContainer;