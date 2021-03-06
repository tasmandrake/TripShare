import React from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import {
  FormLabel,
  FormInput,
  FormValidationMessage
} from 'react-native-elements';
import colors from '../css/colors';
import styles from '../css/EditUser';
import forms from '../css/forms';

export default class NewUser extends React.Component {
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
      user_id: this.props.navigation.state.params.user_id,
      user: {},
      nameErr: false,
      urlErr: false,
      phoneErr: false,
      name: '',
      image_url: ' ',
      phone: '',
      updateUsers: this.props.navigation.state.params.updateUsers,
      updateUser: this.props.navigation.state.params.updateUser,
      imageError: false,
      load: false,
    };
  }

  post = () => {
    let phone = this.state.phone;
    phone = phone.split(/[)(-]/g).join('');
    if (phone.length !== 10) {
      this.setState({ phoneErr: true });
    } else if (!this.state.name && !this.state.image_url && !this.state.phone) {
      this.setState({ nameErr: true, urlErr: true, phoneErr: true });
    } else if (!this.state.name && !this.state.image_url) {
      this.setState({ nameErr: true, urlErr: true });
    } else if (!this.state.name && !this.state.phone) {
      this.setState({ nameErr: true, phoneErr: true });
    } else if (!this.state.phone && !this.state.image_url) {
      this.setState({ phoneErr: true, urlErr: true });
    } else if (!this.state.name) {
      this.setState({ nameErr: true });
    } else if (!this.state.image_url || !this.state.load) {
      this.setState({ urlErr: true });
    } else {
      fetch(`https://split-trip.herokuapp.com/users/${this.state.user_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: this.state.name,
          image_url: this.state.image_url,
          phone,
        })
      })
      .then(res => res.json())
      .then(() => {
        this.state.updateUsers();
        this.state.updateUser();
        this.props.navigation.goBack();
      });
    }
  }

  componentDidMount() {
    fetch(`https://split-trip.herokuapp.com/users/${this.state.user_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        }
    })
    .then(result => result.json())
    .then(user => {
      let phone = user[0].phone;
      phone = '(' + phone.slice(0, 3) + ')' + phone.slice(3, 6) + '-' + phone.slice(6, 10);

      this.setState({
        name: user[0].name,
        image_url: user[0].image_url,
        phone
      });
    });
  }

  updateName = (e) => {
    if (!e) {
      this.setState({ nameErr: true });
      this.setState({ name: e });
    } else {
      this.setState({ nameErr: false });
      this.setState({ name: e });
    }
  }

  updateUrl = (e) => {
    this.setState({ imageError: false, load: false });
    if (!e) {
      this.setState({ urlErr: true });
      this.setState({ image_url: e });
    } else {
      this.setState({ urlErr: false });
      this.setState({ image_url: e });
    }
  }

  updatePhone = (e) => {
    if (!e) {
      this.setState({ phoneErr: true });
      this.setState({ phone: e });
    } else if (isNaN(Number(e.split(/[)(-]/).join('')))) {
      return;
    } else if (e.length > 13) {
      return;
    } else if (e.length > this.state.phone.length) {
      if (e.length === 1) e = '(' + e;
      if (e.length === 4) e += ')';
      if (e.length === 8) e += '-';
      this.setState({ phoneErr: false });
      this.setState({ phone: e });
    } else {
      if (e.length === 1) e = e.slice(0, e.length - 1);
      if (e.length === 5) e = e.slice(0, e.length - 1);
      if (e.length === 9) e = e.slice(0, e.length - 1);
      this.setState({ phoneErr: false });
      this.setState({ phone: e });
    }
  }

  imgErr = () => {
    window.setTimeout(() => {
      if (!this.state.load) this.setState({ imageError: true });
    }, 1500);
  }

  imgErrClear = () => {
    this.setState({ imageError: false, load: true });
  }

  render() {
    return (
      <View style={styles.user}>
        <Image source={require('../css/background2.png')} style={styles.backgroundimage}/>

        <FormLabel containerStyle={forms.labelContainer} labelStyle={forms.labelStyle}>
          Name
        </FormLabel>
        <FormInput
          onChangeText={this.updateName}
          value={this.state.name}
          containerStyle={forms.input}
          placeholderTextColor={colors.lightYellow}
          inputStyle={{color: colors.lightYellow}}
          selectionColor={colors.lightYellow} />
        {
          this.state.nameErr
            ? <FormValidationMessage labelStyle={forms.warn}>
                Please enter a name
              </FormValidationMessage>
            : null
        }

        <FormLabel containerStyle={forms.labelContainer} labelStyle={forms.labelStyle}>
          Image URL
        </FormLabel>
        <FormInput
          onChangeText={this.updateUrl}
          value={this.state.image_url}
          containerStyle={forms.input}
          placeholderTextColor={colors.lightYellow}
          inputStyle={{color: colors.lightYellow}}
          selectionColor={colors.lightYellow} />
        {
          this.state.urlErr
            ? <FormValidationMessage labelStyle={forms.warn}>
                Please enter a URL for the user icon
              </FormValidationMessage>
            : null
        }

        <FormLabel containerStyle={forms.labelContainer} labelStyle={forms.labelStyle}>
          Phone Number
        </FormLabel>
        <FormInput
          onChangeText={this.updatePhone}
          value={this.state.phone}
          containerStyle={forms.input}
          placeholderTextColor={colors.lightYellow}
          inputStyle={{color: colors.lightYellow}}
          selectionColor={colors.lightYellow} />
        {
          this.state.phoneErr
            ? <FormValidationMessage labelStyle={forms.warn}>
                Please enter a 10 digit phone number
              </FormValidationMessage>
            : null
        }

        <Text>{'\n\n\n'}</Text>

        {
          this.state.imageError
            ? <Text style={forms.warn}>
                Could not load the image {'\n\n'} Please try another
              </Text>
            : <View style={styles.box}>
                <Image source={{uri: this.state.image_url}}
                  onError={this.imgErr}
                  onLoad={this.imgErrClear}
                  style={styles.image}/>
              </View>
        }


        <TouchableOpacity onPress={this.post} style={styles.shadow}>
          <Text style={styles.newButton}>
            Edit {this.state.name}
          </Text>
        </TouchableOpacity>

      </View>
    );
  }
}
