
import React, { Component } from 'react';
import {
  ActionSheetIOS,
  CameraRoll,
  ScrollView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  RefreshControl,
  AsyncStorage,
  Animated
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Container, Content, Icon, Header, Left, Body, Right, Segment, Button } from 'native-base'
import { API, Storage } from 'aws-amplify';
import ImageTile from './imagetile'

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};

export default class Browser extends Component {

state = {media: []}

constructor(props){
  super(props);
  this.state = {
      opacity: new Animated.Value(1),
      refreshing: false,
      media: [],
      cursor: 0,
      apiResponse: null,
      noteId: '',
      blackphotos: [],
      display0: [],
      display1: [],
      display2: [],
      displayindex: 0,
      browsertutorial: true
    };
}
 handleChangeNoteId = (event) => {
    this.setState({noteId: event});
  };
componentDidMount(){
  this.views = {};
  this.getBlacklist()
  this.loadphotos(50);

// fill 'Library photos' example with local media
}
sendPicture = async (item) => {
  var time0 = Date.now();
  var time = new Date().getTime();

  //let location = await Location.getCurrentPositionAsync({});
  var latitude = 0; //location.coords.latitude;
  var longitude = 0;//location.coords.longitude;

  user = JSON.parse(await AsyncStorage.getItem("user"));
  let userId = user["username"];

  var random = String(time)+String(latitude)+String(longitude)+String(userId);
  var image_file_name = "image" + random + ".jpg";
  //New
  let newNote = {
    body: {
     "image_uri": image_file_name,
     "latitude": latitude,
     "longitude": longitude,
     "post_time": time,
     "username": userId,
     "default_image": false
   }
  }
  const path = "/images";

  const options = { level: 'public', contentType: 'image/jpeg' };
  fetch(item.photo).then(response => {
    console.log('done fetching image from disk')
    response.blob().then(blob => {
      Storage.put(image_file_name, blob, options).then(() => {
        console.log('done putting image in storage');
        API.put("candidImageHandler", path, newNote).then(apiResponse => {
          console.log(apiResponse);
          this.setState({apiResponse});
        }).catch(e => {console.log("error uploading to candidImageHandler: " + e)})
      }).catch(e => {console.log("error uploading to storage: " + e)})
    })
  }).catch(e => {console.log("error fetching from phone disk: " + e)})
  this.addBlacklist(item.photo);
  this.removePhoto(item);

}

removePhoto(item){
    //Unelegant
    var index = this.state.display0.indexOf(item);
    if (index > -1) {
      this.state.display0.splice(index, 1);
      this.setState({display0: this.state.display0});
    }else{
      index = this.state.display1.indexOf(item);
      if (index > -1) {
        this.state.display1.splice(index, 1)
        this.setState({display1: this.state.display1});
      }else{
        index = this.state.display2.indexOf(item);
        if (index > -1) {
          this.state.display2.splice(index, 1)
          this.setState({display2: this.state.display2});
        }
      }
    }
  }

storePhoto(photo){
    if(this.state.displayindex == 0){
      this.setState({display0: this.state.display0.reverse().concat(photo).reverse()});
      this.setState({displayindex: 1})
    }else if(this.state.displayindex == 1){
      this.setState({display1: this.state.display1.reverse().concat(photo).reverse()});
      this.setState({displayindex: 2})
    }else{
      this.setState({display2: this.state.display2.reverse().concat(photo).reverse()});
      this.setState({displayindex: 0})
    }
  }

loadphotos(howmany){
  CameraRoll.getPhotos({
  first: howmany + this.state.cursor,
  assetType: 'Photos',
})
  .then(data => {
    const media = this.state.media;
    data.edges.forEach((d, i) =>
      {if(i >= this.state.cursor && !this.state.blackphotos.includes(d.node.image.uri)){
      
      this.storePhoto({
        photo: d.node.image.uri,
        key: d.node.image.uri,
        width: d.node.image.width,
        height: d.node.image.height,
      })}},
    );
    this.setState({cursor: this.state.cursor + howmany});
  })
  .catch(error => alert(error));
}

load(){
  this.loadphotos(50)
}
selectedImage(item){
  this.views[item.key].setNativeProps({opacity: .5});
}
displayImage(item){
  opacity = this.state.opacity
  return(
    <ImageTile item={item}></ImageTile>
    )
}
async addBlacklist(uri){
    blacklist = await AsyncStorage.getItem('blacklist');
    if(!blacklist){
      blacklist = {images: []}
    }else{
      blacklist = JSON.parse(blacklist)
    }
    blacklist.images = blacklist.images.concat([uri]);
    console.log("Blacklisting that image");
    AsyncStorage.setItem('blacklist', JSON.stringify(blacklist));
  }
  async getBlacklist(){
    blacklist = await AsyncStorage.getItem('blacklist');
    if(!blacklist){
      blacklist = {images: []}
    }else{
      blacklist = JSON.parse(blacklist)
    }
    blacklist = blacklist.images;
    this.setState({blackphotos: this.state.blackphotos + blacklist});
  }


  render() {
    return(
      <Container style={styles.headcontainer}>
      {this.state.browsertutorial === true ?
      <TouchableOpacity onPress={(e) => {this.setState({browsertutorial: false});}} style={{

    width: Dimensions.get('window').width - 50,
    height: Dimensions.get('window').height - 50,
    top: 30,
    left: 30,
    backgroundColor: 'black',
    borderRadius: 20,
    zIndex: 2, 
    position: "absolute",
    opacity: .8,
    alignItems:'center',
    justifyContent: "center"
  }}>
      <MaterialCommunityIcons name="arrow-up-bold-circle-outline" style={{color:'white', fontSize: 200}}/>
      <Text style={{color:'white', fontSize: 40, textAlign: "center"}}>Tap a picture to set it free! {"\n"} It will be sent to whoever's in it</Text>
      </TouchableOpacity>
      : null}
       <Header style={{ paddingLeft: 10, paddingLeft: 10 }}>
          <Body style={{alignItems:'center', justifyContent: "center"}}>
            <MaterialCommunityIcons name="arrow-up-bold-circle-outline" style={{color:'black', fontSize: 30}}/>
          </Body>
        </Header>
    <View style={styles.wrapper}>
    <ScrollView contentContainerStyle={styles.container}
    onScroll={({nativeEvent}) => {
      if (isCloseToBottom(nativeEvent)) {
        this.load();
      }
    }}
    scrollEventThrottle={400}>
    {this.state.display0.length !== 0 ?
        <FlatList
          data={this.state.display0}
          renderItem={({item}) => this.displayImage(item)}/>
      : <View style={{width: Dimensions.get('window').width/3}}/>
    }
        
    {this.state.display1.length !== 0 ?
        <FlatList
          data={this.state.display1}
          renderItem={({item}) => this.displayImage(item)}/>
      : <View style={{width: Dimensions.get('window').width/3}}/>
    }
     {this.state.display2.length !== 0 ?
        <FlatList
          data={this.state.display2}
          renderItem={({item}) => this.displayImage(item)}/>
      : <View style={{width: Dimensions.get('window').width/3}}/>
    }
    </ScrollView>
</View>
</Container>
)

  }
}


const styles = StyleSheet.create({
  wrapper: {
    flex: 1
},
headcontainer: {
        flex: 1,
        backgroundColor: 'white'
    },
container: {
    flexDirection: 'row',
    paddingHorizontal: 5
},
list: {
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 10,
    paddingHorizontal: 5
}
});