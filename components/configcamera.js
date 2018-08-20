import React, { Component } from "react";
import {View, Text, StyleSheet, TouchableOpacity, CameraRoll, AsyncStorage} from "react-native";
import {Camera, Permissions, GestureHandler, Location} from 'expo'
import {Container, Content, Header, Item, Icon, Input, Button } from "native-base"
import { MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import { RNS3 } from 'react-native-aws3';
import Amplify, { API, Storage } from 'aws-amplify';

const options = {
  keyPrefix: "uploads/",
  bucket: "mirrormediacontent1",
  region: "us-east-1",
  accessKey: "AKIAIXVHTM7IPFBNTNMA",
  secretKey: "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",
  successActionStatus: 201,
  contentType: "image/jpeg"
}

class ConfigCamera extends Component {
  state = {}

	async componentDidMount(){
    this.setState({type: Camera.Constants.Type.front});
		a = await Permissions.askAsync(Permissions.CAMERA);
		b = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    c = await Permissions.askAsync(Permissions.LOCATION);
    if(a && b && c)
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
  	console.log("Recorded the location of a photo: " + photo["uri"]);
    //CameraRoll.saveToCameraRoll(photo["uri"]);
    let image_file_name = "image" + String(Math.floor(Math.random() * 1000)) + ".jpg";
    user = JSON.parse(await AsyncStorage.getItem("user"));
    let userId = user["username"];

    // Use the API module to save the note to the database
    var random = Math.floor(Math.random() * 100000000)
    var image_file_name = "image" + random + ".jpg";

    //New
    let newNote = {
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
          API.put("candidImageHandler", path, newNote).then(apiResponse => {
            console.log(apiResponse);
            this.setState({apiResponse});
          }).catch(e => {
            console.log('fatal error in here!')
            console.log(e);
          })
        })
      })
    })

  /*
	console.log(options);
    RNS3.put(file, options).then(response => {
    console.log(response);
    console.log(response.body);
  	if (response.status !== 201)
    	throw new Error("Failed to upload image to S3");
    })
      //.then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
    })
    .catch((error) => {
      console.error(error);
    });


    fetch('https://rocky-anchorage-68937.herokuapp.com/image', {
       method: 'POST',
       headers: {
       Accept: 'application/json',
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'image_uri': image_file_name,
        'uid' : userID,
        'default_image': true,
      }),
    });*/
  }
};

	render(){
		const {Permission} = this.state
		if(Permission === null)
		{
			return <View />
		}
		else if(Permission === false)
		{
			return <Text> No access to camera </Text>
		}else{
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

