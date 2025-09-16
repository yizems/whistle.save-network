import getSettings from './cgi/getSettings';
import setSettings from './cgi/setSettings';
import saveNetwork from './cgi/saveNetwork';
import getNetwork from './cgi/getNetwork';

export default (router) => {
  router.get('/cgi-bin/get-settings', getSettings);
  router.post('/cgi-bin/set-settings', setSettings);
  router.post('/cgi-bin/save-network', saveNetwork);
  router.get('/cgi-bin/get-network', getNetwork);
};
