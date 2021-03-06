import React from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  FormLabel,
  FormInput,
  FormValidationMessage
} from 'react-native-elements';
import styles from '../css/Receipts';
import colors from '../css/colors';
import forms from '../css/forms';

export default class Receipts extends React.Component {
  static navigationOptions = {
    headerStyle: {
      position: 'absolute',
      backgroundColor: 'transparent',
      top: 0,
      left: 0,
      right: 0,
      borderBottomWidth: 0
    },
    headerTintColor: '#e4ad5a',
  };

  constructor(props) {
    super(props);
    this.state = {
      user: {},
      user_id: this.props.navigation.state.params.user_id,
      trip_id: this.props.navigation.state.params.trip_id,
      newAmount: '',
      err: false,
      updateUsers: this.props.navigation.state.params.updateUsers,
      text: '',
    };

  }
  componentDidMount() {
    fetch(`https://split-trip.herokuapp.com/users/${this.state.user_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).then(result => result.json()).then(user => this.setState({user: user[0]}));
  }

  update = (e) => {
    if (Number(e) < 0) {
      this.setState({err: true});
    } else {
      this.setState({err: false});
      this.setState({newAmount: String(e)});
    }
  }

  post = () => {
    if (this.state.newAmount > 0) {
      const amount = Number(this.state.user.amount_spent) + Number(this.state.newAmount);

      fetch(`https://split-trip.herokuapp.com/users/${this.state.user_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({amount_spent: amount})
      }).then(() => {
        this.setState({newAmount: ''});
        this.props.navigation.goBack();
      });
    }
  }

  updateUser = () => {
    fetch(`https://split-trip.herokuapp.com/users/${this.state.user_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).then(result => result.json()).then(user => this.setState({user: user[0]}));
  }
  camera = (newAmount) => this.setState({ newAmount });

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.user}>

        <Image source={require('../css/background2.png')} style={styles.backgroundimage}/>

        <Text style={styles.name}>
          {this.state.user.name}
        </Text>
        <View style={styles.box}>
          <Image source={{uri: this.state.user.image_url }} style={styles.image} />
        </View>
        <TouchableOpacity onPress={() => navigate('EditUser', {
            user_id: this.state.user_id,
            updateUsers: this.state.updateUsers,
            updateUser: this.updateUser
          })}
        style={styles.shadow2}>
          <Text style={styles.editButton}>
            Edit User
          </Text>
        </TouchableOpacity>

        <View style={styles.form}>
          <FormLabel containerStyle={forms.labelContainer} labelStyle={forms.labelStyle}>
            Amount Spent
          </FormLabel>
          <FormInput keyboardType='numeric'
            onChangeText={this.update}
            value={this.state.newAmount}
            containerStyle={forms.input}
            placeholderTextColor={colors.lightYellow}
            inputStyle={{color: colors.lightYellow}} />
          {
            this.state.err
              ? <FormValidationMessage labelStyle={forms.warn}>
                  Please enter a positive number
                </FormValidationMessage>
              : null
          }
        </View>

        <TouchableOpacity onPress={this.post} style={styles.shadow3}>
          <Text style={styles.addButton}>
            Add New Receipt
          </Text>
        </TouchableOpacity>
        <View>
          <TouchableOpacity onPress={() => navigate('Picture', { camera: this.camera })} style={styles.shadow1}>
            <Text style={styles.button}>
              Take a picture of the receipt
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
