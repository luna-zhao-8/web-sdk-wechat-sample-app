import { findToothbrushes } from '@kolibree/toothbrush-client';
import { Account, AccountDetail, Gender, Profile, ProfilesEntity } from '@kolibree/api-client';

type State = {
  profiles: { id: number; name: string; ownerProfile: boolean }[]
}

type Methods = {
  searchToothbrush(): void;
  signIn(): void;
  signOut(): void;
  createProfile(): void;
  handleUpdateProfileName(e: WechatMiniprogram.BaseEvent<{ id: number }>): void;
  handleDeleteProfile(e: WechatMiniprogram.BaseEvent<{ id: number }>): void;
}

Page<State, Methods>({
  data: {
    profiles: [
      { id: 12, name: 'user1', ownerProfile: true },
      { id: 16, name: 'user2', ownerProfile: false },
    ],
  },
  onLoad(){
    console.log('hello here')
  },
  searchToothbrush() {
    findToothbrushes().subscribe((device) => {
        console.log('device shadow:', device);
    })
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
})

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