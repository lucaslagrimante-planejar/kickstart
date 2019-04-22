import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Form, Button, Icon, Input, Message } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Link, Router } from '../../routes';

class CampaignNew extends Component {
  state = {
    minimumContribution: '',
    campaignName: '',
    errorMessage: '',
    loading: false,
    disabled: false
  };

  onSubmit = async event => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '', disabled: true });

    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(this.state.minimumContribution, this.state.campaignName)
      .send({
        from: accounts[0]
      });

      Router.pushRoute('/');
    } catch (e) {
      this.setState({ errorMessage: e.message })
    }

    this.setState({ loading: false, disabled: false });
  };

  render() {
    return (
      <Layout>
      <h3>Create a Campaign</h3>
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Minimum Contribution </label>
          <Input
           label='wei'
           labelPosition='right'
           placeholder='Minimum Contribution'
           value={this.state.minimumContribution}
           onChange={event =>
             this.setState({ minimumContribution: event.target.value }) } />
        </Form.Field>
        <Form.Field>
          <label>Campaign Name</label>
          <input
           placeholder='Campaign Name'
           value={this.state.campaignName}
           onChange={event =>
             this.setState({ campaignName: event.target.value }) } />
        </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} disabled={this.state.disabled} animated primary>
            <Button.Content visible>Create!</Button.Content>
            <Button.Content hidden>
              <Icon name='plus' />
            </Button.Content>
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
