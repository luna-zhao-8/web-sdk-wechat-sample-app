import {
  createToothbrushWrapper,
  createToothbrushWrapperFromDeviceId,
  DefaultToothbrushWrapper,
  DeviceShadow, deviceUpdateManager,
  findToothbrushes,
  getToothbrushWrapper,
  stopFindingToothbrushes,
  ToothbrushModelId,
} from '@kolibree/toothbrush-client';
import { Account, AccountDetail, Gender, Profile, ProfilesEntity } from '@kolibree/api-client';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { getGlobalData, setGlobalData } from '../../../utils/global';
import ButtonGetPhoneNumber = WechatMiniprogram.ButtonGetPhoneNumber;

type State = {
  toothbrushList: { deviceId: string, deviceName: string }[];
  toothbrush: {
    connectionStatus: string;
    deviceName: string;
    deviceId: string;
    batteryLevel: number;
    serialNumber: string;
    vibrating: boolean;
    firmwareUpdateAvailable: boolean;
  },
  accountId: number;
  profiles: { id: number; name: string; ownerProfile: boolean }[];
  token: string;
}

type Methods = {
  searchToothbrush(): void;
  handleConnect(e: WechatMiniprogram.BaseEvent<{ id: number, name: string }>): void;
  getSerialNumber(): void;
  getBatteryInfo(): void;
  toggleVibrator(): void;
  signIn(e: WechatMiniprogram.ButtonGetPhoneNumber): void;
  signOut(): void;
  createProfile(): void;
  handleUpdateProfileName(e: WechatMiniprogram.BaseEvent<{ id: number }>): void;
  handleDeleteProfile(e: WechatMiniprogram.BaseEvent<{ id: number }>): void;
  navigateToGuidedBrushing(): void;
  navigateToTestYourAngles(): void;
  navigateToMindYourSpeed(): void;
  navigateToTestBrushing(): void;
  startOTAUpdate(): void;
  checkOTAUpdate(): void;
  deviceShadowList: DeviceShadow[];
  circuitBreaker$: Subject<any>;
}

Page<State, Methods>({
  deviceShadowList: [],
  circuitBreaker$: null,
  data: {
    accountId: null,
    toothbrushList: [] as State['toothbrushList'],
    toothbrush: {
      connectionStatus: 'disconnected',
      deviceName: '',
      deviceId: '',
      batteryLevel: 0,
      serialNumber: '',
      vibrating: false,
      firmwareUpdateAvailable: false,
    },
    profiles: [],
    token: null,
  },
  onLoad(): void | Promise<void> {
    this.circuitBreaker$ = new Subject();
    wx.login().then((res) => {
      Account.signInWithWechat(res.code).then(account => {
        wx.login().then(({ code }) => {
          if ('token' in account) {
            this.setData({
              token: account.token,
              code,
            })
          } else {
            setGlobalData({
              accountId: account.id,
              profileId: account.owner_profile_id,
              accessToken: account.access_token,
            })

            this.setData({
              accountId: account.id,
              profiles: profilesSelector(account)
            });
          }
        })
      })
    })
  },
  searchToothbrush() {
    findToothbrushes().subscribe((device) => {
      const { deviceId, deviceName } = device;
      this.setData({
        toothbrushList: [
          ...this.data.toothbrushList,
          { deviceId, deviceName }
        ]
      });
      this.deviceShadowList.push(device);
    })
  },
  handleConnect(e) {
    const { name, id } = e.currentTarget.dataset;
    stopFindingToothbrushes();
    const chosenDevice = this.deviceShadowList.find( (device) => device.deviceId === id );
    createToothbrushWrapper(
      chosenDevice,
      true
    ).then((tb: DefaultToothbrushWrapper) => {
      this.setData({
        toothbrushList: [],
        toothbrush: {
          ...this.data.toothbrush,
          connectionStatus: 'connected',
          deviceName: name,
          deviceId: id,
        },
      });

      setGlobalData({
        tbId: id,
        tbModel: tb.modelId === ToothbrushModelId.G2 ? 'g2' : 'ce2'
      });

      tb.serialNumber.getNotifications$()
        .pipe(takeUntil(this.circuitBreaker$))
        .subscribe((serialNumber) => {
        this.setData({
          toothbrush: {
            ...this.data.toothbrush,
            serialNumber,
          },
        });
      });
      tb.batteryInfo.getNotifications$()
        .pipe(takeUntil(this.circuitBreaker$))
        .subscribe(({ batteryLevel }) => {
        this.setData({
          toothbrush: {
            ...this.data.toothbrush,
            batteryLevel,
          },
        });
      });
      tb.brushingEvent.getNotifications$()
        .pipe(takeUntil(this.circuitBreaker$))
        .subscribe(({ vibratorStatus }) => {
        this.setData({
          toothbrush: {
            ...this.data.toothbrush,
            vibrating: vibratorStatus,
          },
        });
      });
    });
  },

  getSerialNumber() {
    const { deviceId } = this.data.toothbrush;
    const toothbrush = getToothbrushWrapper(deviceId) as DefaultToothbrushWrapper;
    toothbrush.serialNumber.fetch();
  },

  getBatteryInfo() {
    const { deviceId } = this.data.toothbrush;
    const toothbrush = getToothbrushWrapper(deviceId) as DefaultToothbrushWrapper;
    toothbrush.batteryInfo.toggleSubscribe('1');
  },

  toggleVibrator() {
    const { deviceId } = this.data.toothbrush;
    const toothbrush = getToothbrushWrapper(deviceId) as DefaultToothbrushWrapper;
    toothbrush.toggleVibrator.trigger(!this.data.toothbrush.vibrating);
  },
  signIn(e) {
    Account.validateWechatEncryptedPhoneNumber({
      encryptedPhoneNumber: e.detail.encryptedData,
      initialVector: e.detail.iv,
      token: this.data.token,
    }).then((phone) => {
     return Account.getIsPhoneNumberLinked({ phone_number: phone.phone_number, verification_token: phone.token, verification_code: phone.code })
       .then(({ wechat_linked, phone_linked }) => {
         if (!phone_linked && !wechat_linked) {
           //sign up + associate
           Account.signUpWithPhoneNumber({
             phone_number: phone.phone_number,
             verification_token: phone.token,
             verification_code: phone.code,
           }).then((account) => {
             setGlobalData({
               accountId: account.id,
               profileId: account.owner_profile_id,
               accessToken: account.access_token,
             })

             this.setData({
               accountId: account.id,
               profiles: profilesSelector(account)
             });
           }).then(() => {
             wx.login().then(({ code }) => {
               Account.linkAccountWithWeChat(code)
             })
           })
         } else if (phone_linked && !wechat_linked) {
           // associate
           Account.loginWithPhoneNumber({
             phone_number: phone.phone_number,
             verification_token: phone.token,
             verification_code: phone.code,
           }).then((account) => {
             setGlobalData({
               accountId: account.id,
               profileId: account.owner_profile_id,
               accessToken: account.access_token,
             })

             this.setData({
               accountId: account.id,
               profiles: profilesSelector(account)
             });
           }).then(() => {
             wx.login().then(({ code }) => {
               Account.linkAccountWithWeChat(code)
             })
           })
         }
       })
    })
  },
  signOut() {
    Account.logout().then(() => {
      this.setData({
        profiles: [],
      })
    });
  },
  createProfile() {
    Profile.createProfile({ first_name: 'Luc', age_bracket: '-15', gender: Gender.MALE }).then((result) => {
      this.setData({
        profiles: this.data.profiles.concat(profileSelector(result))
      })
    })
  },
  handleUpdateProfileName(event) {
    const { currentTarget: { dataset: { id } } } = event;
    Profile.updateProfile({ first_name: 'God', profile_id: id })
      .then(() => Account.fetchAccount())
      .then((account) => profilesSelector(account))
      .then((profiles) => {
        this.setData({
          profiles,
        });
      })
  },
  handleDeleteProfile(event) {
    const { currentTarget: { dataset: { id } } } = event;
    Profile.deleteProfileById(id)
      .then(() => Account.fetchAccount())
      .then((account) => profilesSelector(account))
      .then((profiles) => {
        this.setData({
          profiles,
        });
      })
  },
  navigateToGuidedBrushing() {
    wx.navigateTo({
      url: '/pages/activity/GuidedBrushingMain/index'
    })
  },
  navigateToTestYourAngles() {
    wx.navigateTo({
      url: '/pages/activity/TestYourAnglesWelcome/index'
    })
  },
  navigateToMindYourSpeed() {
    wx.navigateTo({
      url: '/pages/activity/MindYourSpeedWelcome/index'
    })
  },
  navigateToTestBrushing() {
    wx.navigateTo({
      url: '/pages/activity/TestBrushingWelcome/index'
    })
  },
  checkOTAUpdate() {
    const tbId = getGlobalData('tbId')
    deviceUpdateManager.checkForUpdate(tbId).then((update) => {
      console.log('firmware update available: ', update);
      this.setData({
        toothbrush: {
          ...this.data.toothbrush,
          firmwareUpdateAvailable: update,
        }
      })
    });
  },
  startOTAUpdate() {
    // If firmware update available
    const tbId = getGlobalData('tbId')
    const { error$, progress$, status$ } = deviceUpdateManager.getSessionInfo(tbId)
    error$.subscribe((err) => {
      console.log('device update error', err);
    });
    progress$.subscribe((progress) => {
      console.log('device update progress: ', progress);
    });
    status$.subscribe((status) => {
      console.log('device update status: ', status)
    });
    deviceUpdateManager.startUpdateSession(tbId);
  },
  onUnload(): void | Promise<void> {
    this.circuitBreaker$.next();
    this.circuitBreaker$.complete();
  }
});

function profilesSelector(account: AccountDetail) {
  return account.profiles.map(profileSelector)
}

function profileSelector(profile: ProfilesEntity) {
  return {
    id: profile.id,
    ownerProfile: profile.is_owner_profile,
    name: profile.first_name,
  }
}
