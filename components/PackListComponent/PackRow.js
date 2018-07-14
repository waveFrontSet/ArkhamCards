import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
} from 'react-native';

import EncounterIcon from '../../assets/EncounterIcon';

export default class PackRow extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    pack: PropTypes.object,
    cycle: PropTypes.array,
    setChecked: PropTypes.func,
    setCycleChecked: PropTypes.func,
    checked: PropTypes.bool,
    whiteBackground: PropTypes.bool,
    baseQuery: PropTypes.string,
    compact: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this._onPress = this.onPress.bind(this);
    this._onCheckPress = this.onCheckPress.bind(this);
  }

  onPress() {
    const {
      pack,
      navigator,
      baseQuery,
    } = this.props;
    navigator.push({
      screen: 'Pack',
      title: pack.name,
      passProps: {
        pack_code: pack.code,
        baseQuery,
      },
    });
  }

  onCheckPress() {
    const {
      pack,
      cycle,
      checked,
      setCycleChecked,
      setChecked,
    } = this.props;
    const value = !checked;
    setChecked && setChecked(pack.code, value);

    if (setCycleChecked &&
      pack.position === 1 &&
      pack.cycle_position < 50 &&
      pack.cycle_position > 1 &&
      cycle.length > 0
    ) {
      // This is the lead pack in a cycle.
      Alert.alert(
        `${value ? 'Mark' : 'Clear'} entire cycle?`,
        `${value ? 'Mark' : 'Clear'} all packs in the ${pack.name} cycle?`,
        [
          {
            text: 'No',
          },
          { text: 'Yes',
            onPress: () => {
              setCycleChecked(pack.cycle_position, value);
            },
          },
        ],
      );
    }
  }

  render() {
    const {
      pack,
      checked,
      setChecked,
      whiteBackground,
      compact,
    } = this.props;

    const mythosPack = (pack.position > 1 && pack.cycle_position < 70);
    const backgroundColor = (whiteBackground || mythosPack) ? '#FFFFFF' : '#f0f0f0';
    const textColor = '#222222';
    const iconSize = (mythosPack || compact) ? 24 : 28;
    const fontSize = (mythosPack || compact) ? 16 : 22;
    const rowHeight = mythosPack ? 50 : 60;
    return (
      <View style={[styles.row,
        { backgroundColor, height: rowHeight },
        compact ? { height: 40 } : styles.bottomBorder,
      ]}>
        <TouchableOpacity style={styles.touchable} onPress={this._onPress}>
          <View style={styles.touchableContent}>
            <View style={styles.icon}>
              <EncounterIcon
                encounter_code={pack.code}
                size={iconSize}
                color="#000000"
              />
            </View>
            <Text
              style={[styles.title, { color: textColor, fontSize }]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              { pack.name }
            </Text>
          </View>
        </TouchableOpacity>
        { !!setChecked && (
          <View style={[styles.checkbox, { height: rowHeight }]}>
            <Switch
              value={checked}
              onValueChange={this._onCheckPress}
              onTintColor="#222222"
            />
          </View>
        ) }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  bottomBorder: {
    borderBottomWidth: 1,

  },
  touchable: {
    height: 50,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  touchableContent: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  icon: {
    marginLeft: 8,
    width: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginLeft: 8,
    fontSize: 20,
    fontFamily: 'System',
    flex: 1,
  },
  checkbox: {
    width: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
