import React, { Component } from 'react';
import { Form, Input, Message, Button, Icon } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

class ContributeForm extends Component {
  state= {
    value: '',
    errorMessage: '',
    loading: false,
    disabled: false
  };

  onSubmit = async event => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '', disabled: true });

    try {
      const campaign = Campaign(this.props.address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, 'ether')
      });

      Router.pushRoute(`/campaigns/${this.props.address}`);
    } catch (e) {
      this.setState({ errorMessage: e.message })
    }

    this.setState({ loading: false, disabled: false });
  };

  render() {
    return(
      <Form onSubmit={ this.onSubmit } error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Amount to Contribute</label>
          <Input
            value={this.state.value}
            onChange={ event => this.setState({ value: event.target.value }) }
            label="ether"
            labelPosition="right"
          />
        </Form.Field>

        <Message error header="Oops!" content={this.state.errorMessage} />
        <Button loading={this.state.loading} disabled={this.state.disabled} animated primary>
          <Button.Content visible>Contribute!</Button.Content>
          <Button.Content hidden>
            <Icon name='heart' />
          </Button.Content>
        </Button>
      </Form>
    );
  }
}

export default ContributeForm;
