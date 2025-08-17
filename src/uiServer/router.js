import getSettings from './cgi/getSettings';
import setSettings from './cgi/setSettings';

export default (router) => {
  router.get('/cgi-bin/get-settings', getSettings);
  router.post('/cgi-bin/set-settings', setSettings);
};
