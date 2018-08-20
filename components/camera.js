import React, { Component } from "react";
import {View, Text, StyleSheet, TouchableOpacity, CameraRoll, AsyncStorage} from "react-native";
import {Camera, Permissions, GestureHandler, Location} from 'expo'
import {Container, Content, Header, Item, Icon, Input, Button } from "native-base"
import { MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import Amplify, { API, Storage } from 'aws-amplify';
import aws_exports from './../aws-exports';
import { RNS3 } from 'react-native-aws3';

class CameraComponent extends Component{
	constructor(props) {
    super(props);
    Amplify.configure(aws_exports);
  };


  handleChangeNoteId = (event) => {
    this.setState({noteId: event});
	};

  state = {};

	async componentDidMount(){
    this.setState({
    Permission: null,
    type: Camera.Constants.Type.back,
    apiResponse: null,
      noteId: ''
  });
		a = await Permissions.askAsync(Permissions.CAMERA);
		b = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    c = await Permissions.askAsync(Permissions.LOCATION);
    if(a && b && c)
		  this.setState({Permission: true});
    
	}

	snap = async () => {
  console.log('snapping a picture!');
  if (this.camera) {
    console.log('inside the camera');
  	let location = await Location.getCurrentPositionAsync({});
    var latitude = location.coords.latitude;
    var longitude = location.coords.longitude;
    var time = new Date().getTime();
    let photo = await this.camera.takePictureAsync();
    let userId = await AsyncStorage.getItem('userID');

    console.log("inside the camera part 1");
    var random = Math.floor(Math.random() * 100000000)
    var image_file_name = "image" + random + ".jpg";

    //New
    let newNote = {
      body: {
  	   "default_image": false,
  	   "image_uri": image_file_name,
  	   "latitude": latitude,
  	   "longitude": longitude,
  	   "post_time": time,
  	   "uid": userId
	    }
    }

    console.log("inside the camera part 2");
    const path = "/media";
    try
    {
      const apiResponse = await API.put("mediaCRUD", path, newNote)
      console.log("response from saving note: ");
      console.log(apiResponse);
      console.log('this is working')
      this.setState({apiResponse});
   } catch(e) {
      console.log('error in here!')
      console.log(e)
   }
    // Use the API module to save the note to the database


    const options = { level: 'public', contentType: 'image/jpeg' };
    fetch(photo["uri"]).then(response => {
    	response.blob().then(blob => {
    		Storage.put(image_file_name, blob, options);
    	})
    });


    //Old
    /*
    const file = {
	  // `uri` can also be a file system path (i.e. file://)
	  uri: photo["uri"],
	  name: image_file_name,
	  type: "image/jpeg"
	}
	console.log(options);
    RNS3.put(file, options).then(response => {
    console.log(response);
    console.log(response.body);
  	if (response.status !== 201)
    	throw new Error("Failed to upload image to S3");


	})
      //.then((response) => response.json())
      .then((response) => {
      	console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });*/

    CameraRoll.saveToCameraRoll(photo["uri"]);
    /*
    fetch('https://rocky-anchorage-68937.herokuapp.com/image', {
       method: 'POST',
       headers: {
       Accept: 'application/json',
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'image_uri': image_file_name,
        'uid' : userId,
        'default_image': false
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
				<View style={{position: 'absolute', right: 0, top: 15}}>
					<TouchableOpacity onPress={this.props.signout}>
					<Octicons name="sign-out" style={{color:'white', fontSize: 50}}></Octicons>
					</TouchableOpacity>
          </View>
          <View style={{position: 'absolute', left: 0, top: 15}}>
          <TouchableOpacity onPress={this.props.configure}>
          <MaterialCommunityIcons name="backup-restore" style={{color:'white', fontSize: 50}}></MaterialCommunityIcons>
          </TouchableOpacity>
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




export default CameraComponent

