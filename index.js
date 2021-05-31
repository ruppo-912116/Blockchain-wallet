/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'node-libs-react-native/globals';

import './shim.js';


AppRegistry.registerComponent(appName, () => App);
