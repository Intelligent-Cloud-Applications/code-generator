import { institution } from './constants';

const apiPaths = {
  getProducts: `/any/products/${institution}`,
  getInstructors: `/any/instructor-list/${institution}`,
  getUpcomingSchedule: `/user/upcoming-schedule/${institution}`,
  getPreviousScedule: `/user/previous-schedule/${institution}`,
  getMembers: `/admin/profile-list/${institution}`,
  getStreak: `/user/streak-get/${institution}`,
  getRating: `/admin/rating-fetch/${institution}`,
  getUserLocation: "/user/check-user-location",
};

export default apiPaths;