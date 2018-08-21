import React, { Component } from "react";
import {View, Text, StyleSheet, TouchableOpacity, CameraRoll, AsyncStorage} from "react-native";
import {Camera, Permissions, GestureHandler, Location} from 'expo'
import {Container, Content, Header, Item, Icon, Input, Button } from "native-base"
import { MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import { RNS3 } from 'react-native-aws3';
import Amplify, { API, Storage } from 'aws-amplify';

class ConfigCamera extends Component {

  constructor(props) {
    super(props);
    this.state = {
      Permission: null,
      type: null
    }
  }

	async componentDidMount(){
    this.setState({type: Camera.Constants.Type.front});
		camera = await Permissions.askAsync(Permissions.CAMERA);
		cameraRoll = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    location = await Permissions.askAsync(Permissions.LOCATION);
    if(camera && cameraRoll && location)
		  this.setState({Permission: true});
	}

	snap = async () => {
  if (this.camera) {
    let photo = await this.camera.takePictureAsync();
    try {
        await AsyncStorage.setItem('hasDefault', "1");
        this.props.method()
  	} catch (error) {
  		console.log("Error using storage");
  	}

    user = JSON.parse(await AsyncStorage.getItem("user"));
    let userId = user["username"];

    var random = Math.floor(Math.random() * 100000000)
    var image_file_name = "image" + random + ".jpg";

    //New
    let data = {
      body: {
       "image_uri": image_file_name,
       "latitude": 0,
       "longitude": 0,
       "post_time": 0,
       "username": userId,
       "default_image": true
     }
    }
    const path = "/images";

    const options = { level: 'public', contentType: 'image/jpeg' };
    fetch(photo["uri"]).then(response => {
      response.blob().then(blob => {
        Storage.put(image_file_name, blob, options).then(() => {
          API.put("candidImageHandler", path, data).then(apiResponse => {
            console.log(apiResponse);
            this.setState({apiResponse});
          }).catch(e => {
            console.log('fatal error in here!')
            console.log(e);
          })
        })
      })
    })
  }
};

	render() {
		if(this.state.Permission === null)
		{
			return <View />
		}
		else if(this.state.Permission === false)
		{
			return <Text> No access to camera </Text>
		} else {
			return(

			<View style={{flex:1}}>
				<Camera style={{flex:1}} type={this.state.type} ref={ref => { this.camera = ref; }}>
				<View style={{position: 'absolute', left: 0, right: 0, top: 15, alignItems: 'center', justifyContent: 'center'}}>
					<Text style={{color:'white', fontSize: 40}}>First, we need a selfie!</Text>
				</View>
				<View style={{position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center'}}>
					<TouchableOpacity onPress={this.snap}>
					<MaterialCommunityIcons name="circle-outline" style={{color:'white', fontSize: 100}}></MaterialCommunityIcons>
					</TouchableOpacity>
				</View>
				</Camera>
			</View>

			)
		}
	}
}




export default ConfigCamera

