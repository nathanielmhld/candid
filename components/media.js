import React, { Component } from "react";
import {View, Text, StyleSheet, CameraRoll, AsyncStorage, TouchableOpacity, ImageBackground, Image} from "react-native";
import {Camera, Permissions, GestureHandler, Location, FileSystem} from 'expo'
import {Container, Content, Header, Item, Icon, Input, Button } from "native-base"

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Storage, Auth, API } from 'aws-amplify';
import DynamoDB from 'aws-sdk/clients/dynamodb';


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

    this.state = {
      displayphotos: [],
      storedphotos: [],
      displayphoto: null,
      displayindex: 0,
	  location: null
    }
    this.checkServer = this.checkServer.bind(this);
    }

    async componentDidMount() {
    var intervalID = window.setInterval(this.checkServer, 10000);
  	}

  	async checkServer(){
    	let location = await Location.getCurrentPositionAsync({});
    	this.setState({location: location});
    	user = JSON.parse(await AsyncStorage.getItem("user"));
      let userId = user["username"];
    	var latitude = location.coords.latitude;
    	var longitude = location.coords.longitude;
    	var time = new Date().getTime();

      const apiResponse = await API.get("candidImageHandler","/images/" + userId);
      newPics = JSON.parse(apiResponse.slice(apiResponse.indexOf("["),apiResponse.lastIndexOf("]") + 1).replace(/'/g, "\""));

      for (i = 0; i < newPics.length; i++) {
        if(!this.state.storedphotos.includes(newPics[i])){
          this.setState({storedphotos: this.state.storedphotos.concat(newPics[i])});
          let fileUrl = await Storage.get(newPics[i]);
          let localName = FileSystem.documentDirectory + newPics[i];
          FileSystem.downloadAsync(fileUrl,localName)
          .then(({ uri }) => {
            console.log('Finished downloading to ', uri);
            this.setState({displayphotos: this.state.displayphotos.concat(uri)});
          })
          .catch(error => {
            console.error(error);
          });


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
			<View style={{flex:1}}>
				<ImageBackground style={{flex: 1, flexDirection: 'row'}}

				source={{ uri: this.state.displayphotos[this.state.displayindex]}} alt="Image of you!">

				<TouchableOpacity style={{width: "30%", height: "100%",  opacity: 0, backgroundColor: '#FFFFFF'}} onPress={e => this.scrollBack(e)}>

				</TouchableOpacity>
				<TouchableOpacity style={{width: "70%", height: "100%", opacity: 0, backgroundColor: '#FFFFFF'}} onPress={e => this.scrollForward(e)}>
				</TouchableOpacity>

				</ImageBackground>

				<View style={{position: 'absolute', right: 10, bottom: 10}}>
					<TouchableOpacity onPress={e => this.save(e)}>
					<MaterialCommunityIcons name="cloud-download" style={{color:'white', fontSize: 50}}></MaterialCommunityIcons>
					</TouchableOpacity>
				</View>
			</View>

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

