import { findToothbrushes } from '@kolibree/toothbrush-client';
Page({
  onLoad(){
    console.log('hello here')
  },
  searchToothbrush() {
    findToothbrushes().subscribe((device) => {
        console.log('device shadow:', device);
    })
  }
})