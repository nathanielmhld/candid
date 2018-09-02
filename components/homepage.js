import React from 'react';
import {TextInput, Button, StyleSheet, Text, View, AsyncStorage, TouchableHighlight} from 'react-native';
import {Auth} from 'aws-amplify';
import {Font} from 'expo';

export default class HomePage extends React.Component {

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

  logInPageJump() {
    this.props.logInPage(true);
  }

  signUpPageJump() {
    this.props.signUpPage(true);
  }

  signIn() {
    Auth.signIn(this.state.username, this.state.password).then(user => {
      this.setState({'user': user});
      AsyncStorage.setItem('user', JSON.stringify(user));
      this.props.signInAuth(true);
    }).catch(error => this.setState({issue: error['message']}))
  }

  signUpNow() {
    this.props.signUpAuth(true);
  }

  componentDidMount() {
    Font.loadAsync({
      'custom-font': require('./../assets/fonts/Roboto-Bold.ttf'),
    }).then(response => {this.setState({ fontLoaded: true });});
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
        {this.state.fontLoaded ? (
          <Text style={styles.text}>See the pictures other people have taken of you.
</Text>) : null
        }
        {this.state.issue ? (
          <Text style={styles.issue}>{this.state.issue}</Text>) : null
        }
        </View>
        <View style={styles.middleContainer}>
          <TouchableHighlight style={styles.signUpButton} onPress={this.signUpPageJump.bind(this)} underlayColor='#21ce99'>
            <Text style={styles.textContainerSignUp}>Get Started</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.bottomContainer}>
        <TouchableHighlight style={styles.loginButton} onPress={this.logInPageJump.bind(this)} underlayColor='white'>
          <Text style={styles.textContainerLogIn}>Have an account? <Text style={{color: '#21ce99'}}>Login</Text></Text>
        </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textContainerSignUp: {
    height: 45,
    lineHeight: 45,
    textAlign: 'center',
    fontWeight: 'bold',
    color: "white"
  },
  textContainerLogIn: {
    height: 45,
    lineHeight: 45,
    textAlign: 'left',
    fontWeight: 'bold',
    color: "black"
  },
  input: {
    height: 50,
    borderBottomWidth: 2,
    margin: 10,
    marginLeft: 25,
    marginRight: 25
  },
  signUpButton: {
    backgroundColor: "#21ce99",
    height: 45,
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 0,
    marginBottom: 10
  },
  loginButton: {
    backgroundColor: "white",
    height: 45,
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 0,
    marginBottom: 10
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  bottomContainer: {
    justifyContent: 'center',
    marginTop: 120,
    marginLeft: 40,
    marginRight: 40
  },
  middleContainer: {
    justifyContent: 'center',
    marginLeft: 40,
    marginRight: 40,
    marginBottom: 40
  },
  topContainer: {
    justifyContent: 'center',
    marginTop: 80,
    marginLeft: 40,
    marginRight: 40,
    marginBottom: 20
  },
  text: {
    color: 'black',
    fontSize: 35,
    fontFamily: 'custom-font',
    //fontWeight: 'bold',
    textAlign: 'left',
    paddingTop: 10,
    marginLeft: 5,
    marginRight: 5
  },
  issue: {
    color: 'red',
    fontSize: 15,
    textAlign: 'center',
  }
});
