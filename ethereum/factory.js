import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x1c4bf8a4fFf5eE76898Bf541d15b84eF8ECf6F3d'
);

export default instance;
