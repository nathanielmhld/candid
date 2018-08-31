import React from 'react';
import {TextInput, Button, StyleSheet, Text, View } from 'react-native';
import {Auth} from 'aws-amplify';
import {Font} from 'expo';

export default class SignUpProcess extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      email: '',
      user: {},
      fontLoaded: false,
      issue: null
    }
  }

  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }

  backToSignIn(){
    this.props.signUpAuth(false);
  }

  componentDidMount() {
    Font.loadAsync({
      'custom-font': require('./../assets/fonts/Molluca.ttf'),
    }).then(response => {this.setState({ fontLoaded: true })});
  }

  signUp() {
    Auth.signUp({
      username: this.state.username,
      password: this.state.password,
      attributes: {
        name: this.state.email
      }
    })
    .then(() => {
      console.log('successfully signed up!');
      this.props.signUpAuth(false);
    })
    .catch(error => console.log(error))
  }

  confirmSignUp() {
    Auth.confirmSignUp(this.state.username, this.state.email_code)
    .then(() => {
      console.log('confirmed sign up!')
      this.props.signUpAuth(false);
    })
    .catch(err => console.log('error confirming signing up: ', err))

  }

  render() {
    return (
      <View style={styles.container}>
      <View style={{position: 'absolute', left: 0, top: 15}}>
          <Button title="Back" onPress={this.backToSignIn.bind(this)} />
        </View>
      {this.state.fontLoaded ? (
      <Text style={styles.text}>Candid</Text>) : null}
      {this.state.issue ? (
      <Text style={styles.issue}>{this.state.issue}</Text>) : null}
        <TextInput
          onChangeText={value => this.onChangeText('username', value)}
          style={styles.input}
          placeholder='phone_number'
        />
        <TextInput
          onChangeText={value => this.onChangeText('password', value)}
          style={styles.input}
          secureTextEntry={true}
          placeholder='password'
        />
        <TextInput
          onChangeText={value => this.onChangeText('email', value)}
          style={styles.input}
          placeholder='name'
        />
        <Button title="Sign Up" onPress={this.signUp.bind(this)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
    margin: 10
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  slideDefault: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB'
  },
  text: {
    color: 'black',
    fontSize: 56,
    fontFamily: 'custom-font',
    //fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 10,
  },
  issue: {
    color: 'red',
    fontSize: 15,
    textAlign: 'center',
  }
});
