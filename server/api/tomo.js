import Tomo from '../lib/tomo';

export default new Tomo({
  clientId: process.env.TOMO_CLIENT_ID,
  secretKey: process.env.TOMO_SECRET_KEY,
});
