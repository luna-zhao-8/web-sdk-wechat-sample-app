import {
  findToothbrushes,
  stopFindingToothbrushes,
  DefaultToothbrushWrapper, BrushingMode, DeviceShadow,
} from '@kolibree/toothbrush-client';
import {Account, AccountDetail, Gender, Profile, ProfilesEntity} from '@kolibree/api-client';
import { createToothbrushWrapperFromDeviceId } from "@kolibree/toothbrush-client/lib/device-wrappers";
import { getToothbrushWrapper } from "@kolibree/toothbrush-client/lib/device-registry";

type State = {
  toothbrushes: { deviceId: string, deviceName: string }[],
  connectionStatus: string,
  deviceName: string,
  deviceId: string,
  batteryInfo: { batteryLevel: number },
  serialNumber: string,
  brushingMode: string,
  vibrating: boolean,
  profiles: { id: number; name: string; ownerProfile: boolean }[],
}

type Methods = {
  searchToothbrush(): void;
  stopSearchingToothbrush(): void;
  handleConnect(e: WechatMiniprogram.BaseEvent<{ id: number, name: string }>): void;
  getSerialNumber(): void;
  setBrushingMode(): void;
  getBatteryInfo(): void;
  toggleVibrator(): void;
  signIn(): void;
  signOut(): void;
  createProfile(): void;
  handleUpdateProfileName(e: WechatMiniprogram.BaseEvent<{ id: number }>): void;
  handleDeleteProfile(e: WechatMiniprogram.BaseEvent<{ id: number }>): void;
  deviceShadowList: DeviceShadow[];
}

Page<State, Methods>({
  deviceShadowList: [],
  data: {
      toothbrushes: [] as State['toothbrushes'],
      connectionStatus: 'disconnected',
      deviceName: '',
      deviceId: '',
      batteryInfo: { batteryLevel: 0 },
      serialNumber: '',
      brushingMode: 'clean',
      vibrating: false,
      profiles: [
      { id: 12, name: 'user1', ownerProfile: true },
      { id: 16, name: 'user2', ownerProfile: false },
    ],
  },

  onLoad(){
    console.log('hello here');
  },
  onUnload(){
    this.stopSearchingToothbrush();
  },
  onHide() {
    this.stopSearchingToothbrush();
  },
  searchToothbrush() {
    findToothbrushes().subscribe((device) => {
      console.log('device shadow:', device);
      const { deviceId, deviceName } = device;
      this.setData({
        toothbrushes: [
          ...this.data.toothbrushes,
          { deviceId, deviceName }
        ]
      });
      this.deviceShadowList.push(device);
    })
  },

  stopSearchingToothbrush() {
    stopFindingToothbrushes();
  },

  handleConnect({currentTarget: {dataset: { id, name }}}) {
    this.stopSearchingToothbrush();
    const chosenDevice = this.deviceShadowList.find( (device) => device.deviceId === id );
    createToothbrushWrapperFromDeviceId(
      chosenDevice.deviceId,
      {registerInstance: true}
    ).then((tb) => {
      this.setData({
        toothbrushes: [],
        connectionStatus: 'connected',
        deviceName: name,
        deviceId: id,
      })
    });
  },

  getSerialNumber() {
    const wrapper = getToothbrushWrapper(this.data.deviceId) as DefaultToothbrushWrapper;
    wrapper.serialNumber.fetch().then();
    wrapper.serialNumber.getNotifications$().subscribe((number) => {
      this.setData({
        serialNumber: number
      })
    })
  },

  setBrushingMode() {
    const wrapper = getToothbrushWrapper(this.data.deviceId) as DefaultToothbrushWrapper;
    wrapper.brushingMode.fetch();
    let time = + new Date();
    wrapper.brushingMode.update({ mode: BrushingMode.WHITENING, timestamp: time });
  },

  getBatteryInfo() {
    const wrapper = getToothbrushWrapper(this.data.deviceId) as DefaultToothbrushWrapper;
    wrapper.batteryInfo.toggleSubscribe('1');
    const subscription = wrapper.batteryInfo.getNotifications$().subscribe((info) => {
      this.setData({
        batteryInfo: {
          batteryLevel: info.batteryLevel
        }
      })
    })
    if( this.data.batteryInfo.batteryLevel !== 0 ) {
      subscription.unsubscribe();
    }
  },

  toggleVibrator() {
    const wrapper = getToothbrushWrapper(this.data.deviceId) as DefaultToothbrushWrapper;
    if (this.data.vibrating === false) {
      wrapper.toggleVibrator.trigger(true);
      this.setData({
        vibrating: true
      })
    } else {
      wrapper.toggleVibrator.trigger(false);
      this.setData({
        vibrating: false
      })
    }
  },

  signIn() {
    wx.login().then((res) => {
      Account.signInWithWechat(res.code).then((account: AccountDetail) => {
        console.log('account info: ', account);
        this.setData({
          profiles: profilesSelector(account)
        })
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
