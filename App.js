import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  NetInfo,
  Alert,
  StatusBar,
  AppState
} from 'react-native';
import RNFB from 'react-native-fetch-blob';
import axios from 'axios';
import hash from 'object-hash';
import * as Progress from 'react-native-progress';
import md5 from 'md5';
import base64 from 'base-64';
import Routes from './src/components/Routes';
import DeviceInfo from 'react-native-device-info';
import KeepAwake from 'react-native-keep-awake';
import _ from 'lodash';


export default class App extends Component {

  constructor() {
    super();

    // console.ignoredYellowBox = ['Setting a timer'];
  }

  state = {
    downloadedL: 0,
    downloaded: 0,
    isLoading: 1,
    visibleDownload: false,
    indeterminate: true,
    visibleDownloadError: false,
    total: 0,
    mbDone: 0,
    appState: AppState.currentState
  };


  isLoading() {
    const deviceId = DeviceInfo.getUniqueID();
    let dirs = RNFB.fs.dirs;
    let fetchedProject = {};
    let server = '';
    let lastChangesOld = '';
    const projectJsonURL = 'http://www.cduppy.com/salescms/?a=ajax&do=getProject&projectId=3&token=1234567890&deviceId=' + deviceId;
    //const projectJsonURL = 'http://www.fotoberza.rs/cmstest/?a=ajax&do=getProject&projectId=3&token=1234567890&deviceId=' + deviceId;
    const pathToProjectJson = dirs.DocumentDir + '/projectJson.json';

    let fetchedContent = {};
    const pathToContentJson = dirs.DocumentDir + '/contentJson.json';
    const contentJsonURLReqParametri = '?a=ajax&do=getContent&projectId=3&token=1234567890&deviceId=' + deviceId;
    let contentJsonURL = '';

    const pathToCheckedFiles = dirs.DocumentDir + '/checkedFiles.json';
    let checkedFiles = { failedDownloads: [], allDownloaded: false };


    projectJsonLogic = () => {
      return new Promise((resolve, reject) => {
        fetch(projectJsonURL)
          .then(res => res.json())
          .then(res => { fetchedProject = res; return Promise.resolve() })
          .then(() => RNFB.fs.exists(pathToProjectJson))
          .then(res => !res ? nePostojiProjectJson() : postojiProjectJson())
          .then(() => checkServer())
          .then(res => { console.log(res.config.url); server = res.config.url; return Promise.resolve(); })
          .then(() => { contentJsonURL = server + contentJsonURLReqParametri; return Promise.resolve() })
          .then(() => resolve())
          .catch((err) => reject(err))
      })
    }

    nePostojiProjectJson = () => {
      console.log('nePostojiProjectJson()');
      return new Promise((resolve, reject) => {
        RNFB.config({ path: pathToProjectJson }).fetch('GET', projectJsonURL)
          .then(res => { console.log(res.path()); global.projectJson = fetchedProject; return Promise.resolve() })
          .then(() => resolve())
          .catch((err) => reject(err));
      })
    }

    postojiProjectJson = () => {
      console.log('postojiProjectJson()');
      return new Promise((resolve, reject) => {
        RNFB.fs.readFile(pathToProjectJson, 'utf8')
          .then(res => {
            const projectJsonObj = JSON.parse(res);
            lastChangesOld = projectJsonObj.lastChanges;
            if (hash(fetchedProject) == hash(projectJsonObj)) {
              console.log('hashevi projectJsona su isti!');
              global.projectJson = projectJsonObj;
              return resolve();
            } else {
              // ovde obrisi check files
              console.log('hashevi projectJsona su razliciti!');
              global.projectJson = fetchedProject;
              RNFB.fs.unlink(pathToCheckedFiles)
                .then(() => RNFB.config({ path: pathToProjectJson }).fetch('GET', projectJsonURL))
                .then(() => resolve());
            }
          })
      })
    }

    checkServer = () => {
      let a = global.projectJson.project.servers.map(server =>
        axios.get(server)
      );
      return Promise.resolve(a[0]);
    }

    checkForFile = () => {
      return new Promise((resolve, reject) => {
        RNFB.fs.exists(pathToCheckedFiles)
          .then(res => {
            if (!res) {
              return resolve([]);
            } else {
              RNFB.fs.readFile(pathToCheckedFiles, 'utf8')
                .then(data => {
                  data = JSON.parse(data);
                  if (data.failedDownloads.length > 0) {
                    checkedFiles = data;
                    return resolve(data.failedDownloads);
                  } else if (data.allDownloaded) {
                    return reject('Postoji checkedFiles.')
                  }
                })
            }
          })
      })
    }

    a = () => {
      return new Promise((resolve, reject) => {
        let a = require('./codebeautify.json');
        return resolve(a);
      })
    }

    contentJsonLogic = () => {
      return new Promise((resolve, reject) => {
        fetch(contentJsonURL)
          .then(res => res.json())
          .then(res => { fetchedContent = res; return Promise.resolve() })
          .then(() => RNFB.fs.exists(pathToContentJson))
          .then(res => !res ? nePostojiContentJson() : postojiContentJson())
          .then(() => resolve())
          .catch((err) => reject(err))
      })
    }

    nePostojiContentJson = () => {
      console.log('nePostojiContentJson()');
      return new Promise((resolve, reject) => {
        RNFB.config({ path: pathToContentJson }).fetch('GET', contentJsonURL)
          .then(() => { global.globalJson = fetchedContent; return Promise.resolve() })
          .then(() => resolve('nije postojao contentJson, al sad je napravljen'))
          .catch((err) => reject(err))
      })
    }

    postojiContentJson = () => {
      console.log('postojiContentJson()');
      return new Promise((resolve, reject) => {
        RNFB.fs.readFile(pathToContentJson, 'utf8')
          .then(res => {
            global.globalJson = JSON.parse(res);

            if (fetchedProject.lastChanges == lastChangesOld) {
              //if(hash(fetchedContent) == hash(global.globalJson)) {
              //global.globalJson
              console.log('usao u if od postojiContentJson()')
              return resolve()
            } else {
              console.log('Else u postoji content JSON')
              obrisiStare(global.globalJson, fetchedContent);
              global.globalJson = fetchedContent;

              RNFB.config({ path: pathToContentJson }).fetch('GET', contentJsonURL)
                .then(() => resolve())
            }
          })
      })
    }

    obrisiStare = (stariJson, noviJson) => {
      return new Promise((resolve, reject) => {
        let stageRemove = stariJson.files.filter(x => noviJson.files.map(nj => nj.hash).indexOf(x.hash) < 0);
        stageRemove.map(x => {
          deleteOne(x)
        })
      })
    }

    deleteOne = (file) => {
      let src = dirs.DocumentDir + '/' + file.fileId + '.' + file.ext;
      RNFB.fs.exists(src)
        .then(res => res ? RNFB.fs.unlink(src).then(() => console.log('Obrisa fajl: ' + src)) : console.log('Ne postoji taj fajl za brisanje'))
    }

    downloadOne = (file) => {
      return new Promise((resolve, reject) => {
        let t0 = Date.now();
        RNFB.config({ path: dirs.DocumentDir + '/' + file.fileId + '.' + file.ext }).fetch('GET', server + global.projectJson.project.contentDir + file.filename + '?deviceId=' + deviceId)
          .then(r => {
            if (r.info().status == 200) {
              console.log('One file downloaded at ', r.path() + ', with status code: ' + r.info().status);
              let t1 = Date.now();
              this.setState(prevState => ({ downloaded: prevState.downloaded + 1, mbDone: prevState.mbDone + Math.round(Number(file.size) / 1024 / 1024) }));
              let time = t1 - t0;
              let sizeOne = Number(file.size) / 1024.0;
              let dlSpeed = sizeOne / time;
              global.averageSpeed = 0.001 * dlSpeed + (1 - 0.001) * global.averageSpeed;
              return resolve();
            } else if (r.info().status == 404) {
              console.log('Fajl ne postoji: ' + file.fileId);
              checkedFiles.failedDownloads.push(file);
              RNFB.fs.writeFile(pathToCheckedFiles, JSON.stringify(checkedFiles), 'utf8');
              RNFB.fs.unlink(dirs.DocumentDir + '/' + file.fileId + '.' + file.ext);
              return resolve();
            } else {
              console.log('Neka druga greska');
              checkedFiles.failedDownloads.push(file);
              RNFB.fs.writeFile(pathToCheckedFiles, JSON.stringify(checkedFiles), 'utf8');
              RNFB.fs.unlink(dirs.DocumentDir + '/' + file.fileId + '.' + file.ext);
              return resolve();
            }

          })
          .catch((err) => {
            console.log('Fajl koruptovan: ' + file.fileId);
            checkedFiles.failedDownloads.push(file);
            RNFB.fs.writeFile(pathToCheckedFiles, JSON.stringify(checkedFiles), 'utf8');
            RNFB.fs.unlink(dirs.DocumentDir + '/' + file.fileId + '.' + file.ext);
            return resolve()
          })
      })
    }

    calculateSize = (filesArr) => {
      return new Promise((resolve, reject) => {
        let result = 0;
        if (filesArr.length <= 0) {
          reject('Array is empty')
        } else {
          filesArr.forEach(element => {
            result += Number(element.size);
          });
          result = (result / 1024 / 1024).toFixed(2);
          this.setState({ visibleDownload: true, total: result });
          return resolve(result);
        }
      })
    }

    getBenchmarkTime = (benchmarkFileURL) => {
      RNFB.config({ path: pathToSpeedBenchmarkFile })
        .fetch('GET', benchmarkFileURL)
        .then(benchmarkFile => {

        })
    }

    alertForDownload = (mb, niz) => {
      return new Promise((resolve, reject) => {
        if (!mb) {
          reject();
        }
        NetInfo.getConnectionInfo()
          .then((res) => {
            console.log('get connetion blok')
            const speedBenchmarkFile = server + projectJson.project.speedBenchmarkFile;
            console.log(speedBenchmarkFile);
            // path to speed
            const pathToSpeedBenchmarkFile = dirs.DocumentDir + '/benchmark666.jpg';
            const timeBeforeDownload = Date.now();
            // const nekiTest = 'http://ipv4.download.thinkbroadband.com/5MB.zip'
            RNFB.config({ path: pathToSpeedBenchmarkFile }).fetch('GET', speedBenchmarkFile)
              // RNFB.config({ path: pathToSpeedBenchmarkFile }).fetch('GET', nekiTest)
              .then((benchmarkFile) => {
                const timeAfterDownload = Date.now();
                const benchmarkTime = timeAfterDownload - timeBeforeDownload; // time to dl file
                // console.log('skinuo benchmark file' + ' ' + benchmarkTime);
                RNFB.fs.readFile(benchmarkFile.path(), 'base64')
                  .then(data => {
                    const decodedData = base64.decode(data);
                    const Bytes = decodedData.length; // file size in Kbytes
                    const Bits = Bytes * 8;
                    const KBitsPerSecond = Bits / benchmarkTime;
                    const MBitsPerSecond = KBitsPerSecond / 1024;

                    let cellularType = res.effectiveType;
                    let warningString = res.type == 'cellular' ? 'Warning, you are on cellular ' + cellularType + ' network, this download could be charged.' : '';
                    let downloadSpeed = MBitsPerSecond;
                    global.averageSpeed = downloadSpeed;
                    let est = downloadSpeed != 0 ? (mb / downloadSpeed / 60).toFixed(0) + ' minutes ' + ((mb / downloadSpeed).toFixed(0) % 60) + ' seconds' : 'inf.';
                    Alert.alert(
                      'About to download ' + mb + ' MB',
                      '' + warningString + '\n' + 'Estimated time: ' + est + '.\nDo you wish to download?',

                      [
                        { text: 'OK', onPress: () => resolve() },
                        {
                          text: 'Skip',
                          onPress: () => {
                            checkedFiles.allDownloaded = false;
                            checkedFiles.failedDownloads = niz;
                            RNFB.fs.writeFile(pathToCheckedFiles, JSON.stringify(checkedFiles), 'utf8');
                            return reject('Pritisnut reject');
                          }
                        }
                      ], { cancelable: false }

                    )

                  })
              })
              .catch(error => {
                let cellularType = res.effectiveType;
                let warningString = res.type == 'cellular' ? 'Warning, you are on cellular ' + cellularType + ' network, this download could be charged.' : '';
                let downloadSpeed = 0;
                if (res.type == 'cellular')
                  switch (res.effectiveType) {
                    case '2g':
                      downloadSpeed = 0.04 / 8.0;
                      break;
                    case '3g':
                      downloadSpeed = 6.04 / 8.0;
                      break;
                    case '4g':
                      downloadSpeed = 18.4 / 8.0;
                      break;
                  }
                if (res.type == 'wifi')
                  downloadSpeed = 23.5 / 8.0;
                global.averageSpeed = downloadSpeed;
                let est = downloadSpeed != 0 ? (mb / downloadSpeed / 60).toFixed(0) + ' minutes ' + ((mb / downloadSpeed).toFixed(0) % 60) + ' seconds' : 'inf.';
                Alert.alert(
                  'About to download ' + mb + ' MB',
                  '' + warningString + '\n' + 'Estimated time: ' + est + '.\nDo you wish to download?',
                  [{ text: 'OK', onPress: () => resolve() }, { text: 'Skip', onPress: () => reject() }]
                )
              });
          })
      })
    }

    checkHashFiles = (pocetni) => {
      console.log('usao u hash files()');
      return new Promise((resolve, reject) => {
        let downloadStage = pocetni;
        checkedFiles.failedDownloads = [];
        let a = global.globalJson.files.map(file =>
          RNFB.fs.exists(dirs.DocumentDir + '/' + file.fileId + '.' + file.ext)
            .then(res => {
              if (!res) { /* && md5(dirs.DocumentDir + '/' + file.fileId + '.' + file.ext)  != file.hash*/
                downloadStage.push(file);
                return Promise.resolve();
              }
            })
        );
        //this.setState({ hashingL: a.length });
        Promise.all(a)
          .then(() => { downloadStage = _.uniqBy(downloadStage, 'fileId'); return Promise.resolve(); })
          .then(() => resolve(downloadStage))
          .catch(err => console.log('Greska kod checkHashFiles()' + err))
      })
    }

    prepareFilesArrayIntoChunks = (filesArr, sizeOfChunk) => {
      let chunkedArray = [];
      for (let i = 0; i < filesArr.length; i += sizeOfChunk) {
        chunkedArray.push(filesArr.slice(i, i + sizeOfChunk));
      }
      return chunkedArray;
    }

    chunkDownload = (c) => {
      return new Promise((resolve, reject) => {
        let a = c.map(file =>
          downloadOne(file)
        )
        Promise.all(a)
          .then(() => resolve())
      })
    }

    function processArray(array, fn) {
      var index = 0;

      return new Promise((resolve, reject) => {

        function next() {
          if (index < array.length) {
            fn(array[index++]).then(next, reject);
          } else {
            resolve();
          }
        }
        next();
      })
    }


    downloadFiles = (filesArr) => {
      console.log('usao u downloadFiles()')
      return new Promise((resolve, reject) => {
        /*let b = prepareFilesArrayIntoChunks(filesArr, 1);
        let a = b.map(chunk =>
          chunkDownload(chunk)
            .then(() => console.log('zavrsio 5'))
        );*/



        /*let a = filesArr.map(file =>
          downloadOne(file)
        );*/
        this.setState({ downloadedL: filesArr.length });
        //Promise.all(a)
        processArray(filesArr, downloadOne)
          .then(() => console.log('All downloads finished!'))
          .then(() => checkedFiles.allDownloaded = true)
          .then(() => RNFB.fs.writeFile(pathToCheckedFiles, JSON.stringify(checkedFiles), 'utf8'))
          .then(() => resolve())
          .catch(err => console.log('Greska kod downloadFIles(): ' + err))


      })
    }
    akoImaNeta = () => {
      projectJsonLogic()
        .then(() => contentJsonLogic())
        .then(() => checkForFile())
        .then((a) => checkHashFiles(a))
        .then((niz) => calculateSize(niz)
          .then((mb) => alertForDownload(mb, niz))
          .then(() => downloadFiles(niz))
        )
        .catch(err => console.log('Catch od glavnog bloka od checkHashFiles: ' + err))
        .then(() => this.setState({ isLoading: 0 }))
    }

    akoNemaNeta = () => {
      RNFB.fs.exists(pathToProjectJson)
      .then(res => {
        if(res) {
          RNFB.fs.readFile(pathToProjectJson, 'utf8')
          .then(res => {global.projectJson = JSON.parse(res); return Promise.resolve() })
        } else {
          this.setState({ isLoading: -1 });
        }
      })
      RNFB.fs.exists(pathToContentJson)
        .then(res => {
          if (!res) {
            this.setState({ isLoading: -1 })
          } else {
            RNFB.fs.readFile(pathToContentJson, 'utf8')
              .then(res => { global.globalJson = JSON.parse(res); return Promise.resolve() })
              .then(() => this.setState({ isLoading: 0 }))
          }
        })
    }



    this.isNetworkConnected()
      .then(res => {
        if (res) {
          akoImaNeta();
        } else {
          akoNemaNeta();
        }
      })



  }// End of isLoading()

  isNetworkConnected = () => {
    if (Platform.OS === 'ios') {
      return new Promise(resolve => {
        const handleFirstConnectivityChangeIOS = isConnected => {
          NetInfo.isConnected.removeEventListener('connectionChange', handleFirstConnectivityChangeIOS);
          resolve(isConnected);
        };
        NetInfo.isConnected.addEventListener('connectionChange', handleFirstConnectivityChangeIOS);
      });
    }
    return NetInfo.isConnected.fetch();
  }

  componentWillMount() {
    KeepAwake.activate();
    this.isLoading();
  }

  syncApp() {
    const projectJsonURL = 'http://www.cduppy.com/salescms/?a=ajax&do=getProject&projectId=3&token=1234567890';
    this.isNetworkConnected()
    .then(res => {
      if(res) {
        RNFB.fs.readFile(RNFB.fs.dirs.DocumentDir + '/checkedFiles.json', 'utf8')
        .then((res) => JSON.parse(res))
        .then(fajlic => {
          fetch(projectJsonURL)
            .then(res => res.json())
            .then(res => {
              let neSkinutiFajlovi = fajlic.failedDownloads.length > 0 ? 'But there seems to be ' + fajlic.failedDownloads.length + ' missing files. If this problem persists, that means files are missing from the server. Contact your admin to fix it.' : 'Seems everything is OK. \nIf you want you can restart application anyway.';
              if (res.lastChanges == global.projectJson.lastChanges) {
                 //Alert.alert('App is already up to date!', neSkinutiFajlovi, [{ text: 'Sync', onPress: () => { RNRestart.Restart(); } }, { text: 'Cancel', onPress: () => { } }])
              }
              else {
                Alert.alert('There seems to be update!', 'Do you wish to sync?', [{ text: 'Sync', onPress: () => { RNRestart.Restart(); } }, { text: 'Cancel', onPress: () => { } }]);
              }
            })
        })
      } else {
        //Alert.alert('Offline', 'You seem to be offline.', [{ text: 'OK', onPress: () => {} }]);
      }
    })

  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active' && this.state.isLoading == 0) {
      console.log('App has come to the foreground!');
      this.syncApp();
    }
    this.setState({ appState: nextAppState });
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    console.log('componentDidMount() od App.js');
  }

  calcProgress() {
    if (this.state.downloaded == 1) {
      this.state.indeterminate = false;
    }
    if (this.state.downloaded > 0) {
      return this.state.downloaded / this.state.downloadedL;
    }
  }



  render() {
    if (this.state.isLoading == 0) {
      return (
        <View style={styles.container}>
          <Routes />
        </View>
      );

    } else if (this.state.isLoading == 1) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: "100%", height: "100%", backgroundColor: '#4169e1' }}>
          <StatusBar barStyle="dark-content" hidden={true} />
          <View style={{ flex: 2, alignItems: 'center', justifyContent: 'flex-end', backgroundColor: '#4169e1' }}>
            <Text style={styles.loadTextF}>Loading, please wait...</Text>
            {this.state.visibleDownloadError && <Text style={styles.loadText}>There seems to be corrupted download. {'\n'}Please restart the application if you see the bar below stuck.</Text>}
            {this.state.visibleDownload && <Text style={styles.loadText}>Downloaded {this.state.downloaded} of {this.state.downloadedL} files.</Text>}
            {this.state.visibleDownload && <Text style={styles.loadText}>Downloaded {this.state.mbDone} MB of {this.state.total} MB.</Text>}
            {this.state.visibleDownload &&
              <Text style={styles.loadText}>
                Remaining time: {global.averageSpeed && ((((this.state.total - this.state.mbDone) / global.averageSpeed) / 60).toFixed(0) != 0 ? (((this.state.total - this.state.mbDone) / global.averageSpeed) / 60).toFixed(0) + ' min' : (((this.state.total - this.state.mbDone) / global.averageSpeed)).toFixed(0) + ' seconds')}</Text>}

          </View>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#4169e1' }} >
            <Progress.Bar
              style={{ margin: 10, opacity: this.state.showProgress }}
              indeterminate={this.state.indeterminate}
              progress={this.calcProgress()}
              color='#fff'
            />

          </View>
        </View >
      );
    }
    else if (this.state.isLoading == -1) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: "100%", height: "100%", backgroundColor: '#4169e1' }}>
          <StatusBar barStyle="dark-content" hidden={true} />
          <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center', backgroundColor: '#4169e1' }}>
            <Text style={styles.loadText}>You are starting app for first time and you are offline.</Text>
            <Text style={styles.loadText}>We need to show some content, and for this we need to download it.</Text>
            <Text style={styles.loadText}>Please connect to internet first.</Text>
          </View>
        </View>
      );
    }

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%'
  },
  loadText: {

    color: 'white',
    fontSize: 30,
    paddingTop: 20
  },
  loadTextF: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 30,
    paddingBottom: 20
  }
});
