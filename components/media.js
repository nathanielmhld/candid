import React, { Component } from "react";
import {View, Text, StyleSheet, CameraRoll, AsyncStorage, TouchableOpacity, ImageBackground, Image} from "react-native";
import {Camera, Permissions, GestureHandler, Location, FileSystem, Notifications} from 'expo'
import {Container, Content, Header, Item, Icon, Input, Button } from "native-base"

import { MaterialCommunityIcons } from '@expo/vector-icons';

import Amplify, { Storage, Auth, API } from 'aws-amplify';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import aws_exports from './../aws-exports';
import Swiper from 'react-native-swiper';


const styles = StyleSheet.create({
  slideDefault: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB'
  },
  text: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  }
})

class MediaComponent extends Component{


	constructor(props) {
    super(props);
    Amplify.configure(aws_exports);

    this.state = {
      displayphotos: [],
      storedphotos: [],
      newPics: [],
      displayphoto: null,
      displayindex: 0,
	  location: null,
    intervalID: null,
    }
    this.checkServer = this.checkServer.bind(this);
    }

    async componentDidMount() {
    this.checkServer();
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
    //this.setState({intervalID: window.setInterval(this.checkServer, 10000)});
  	}
    _handleNotification = (notification) => {
    this.checkServer();
  };

  	async checkServer(){
    	let location = await Location.getCurrentPositionAsync({});
    	this.setState({location: location});
      raw = await AsyncStorage.getItem("user");
      if(raw === null)
        return
    	user = JSON.parse(raw);
      let userId = user["username"];
    	var latitude = location.coords.latitude;
    	var longitude = location.coords.longitude;
    	var time = new Date().getTime();
      apiResponse = await API.get("candidImageHandler","/images/" + userId).catch(error => {
            console.error(error);
            console.error("Darn");
          });
      let newPics = JSON.parse(apiResponse.slice(apiResponse.indexOf("["),apiResponse.lastIndexOf("]") + 1).replace(/'/g, "\""));
      for (i = 0; i < newPics.length; i++) { 
      if(!this.state.storedphotos.includes(newPics[i])){
      this.setState({storedphotos: this.state.storedphotos.concat(newPics[i])});
      fileUrl = await Storage.get(newPics[i]);
      let localName = FileSystem.documentDirectory + newPics[i];
      FileSystem.downloadAsync(fileUrl,localName)
          .then(({ uri }) => {
            console.log('Finished downloading to ', uri);
            this.setState({displayphotos: this.state.displayphotos.reverse().concat(uri).reverse()});

          })
        }
      }
    	console.log(latitude + " , " + longitude);
    }

	async scrollForward(e){
		if(this.state.displayindex < this.state.displayphotos.length - 1){
			this.setState({displayindex: this.state.displayindex + 1
						});
		}

	}
	async scrollBack(e){
		if(this.state.displayindex > 0){
			this.setState({displayindex: this.state.displayindex - 1
						});
		}
	}
	async save(e){
		CameraRoll.saveToCameraRoll(this.state.displayphotos[this.state.displayindex]);
	}

	render(){
		if (this.state.displayphotos.length != 0){
			return(
      <Swiper ref='swiper' loop={false} showsPagination={false} index={0} removeClippedSubviews={true} horizontal={false}>
      {
        this.state.displayphotos.map((photo, key) => (
          <View style={{flex:1}} key={key}>
            <ImageBackground style={{flex: 1, flexDirection: 'row'}} source={{ uri: photo}} alt="Image of you!">
            </ImageBackground>
          </View>
          )
        ) 
      }
			
      </Swiper>
			)
		}else{
			return(
			<View style={styles.slideDefault}>
                <Text style={styles.text}>No candids yet!</Text>
              </View>
              )

		}
		}
	}






export default MediaComponent

