---
title: vue下拉组件使用键盘上下键选择
date: 2018-08-21 14:31:27
tags: [vue,组件]
categories: vue
---

选择国家组件，通过键盘down\up键选择。

组件代码:
```
<template>
    <div class="iti-wrap">
        <div class="iti-con" :class="them=='white'?'iti-con-white':''" @click="toggle">
            <div :class="'iti-flag ' + currentCountry"></div>
            <img class="drop-down" :src="require('img/drop_down.png')" alt="">
        </div>
        <div class="country-list-con intl-tel-input" v-show="showPanel" @click="(e)=>{e.stopPropagation()}"
             @keydown.up="keyupdown('up')" @keydown.down="keyupdown('down')"
             @keydown.enter="showPanel = false"
        >
            <input class="search" type="text" ref="input" v-model="searchText">
            <ul class="country-list" ref="list">
                <li v-for="item in allCountries"
                    v-if="searchText === '' || item.name.toLowerCase().indexOf(searchText)!=-1"
                    @click="chooseCountry(item,true)"
                    :data-val="JSON.stringify(item)"
                    :class="{
                    'country': true,
                    'active': true,
                    'highlight': countryCode == item.dialCode
                }">
                    <div class="flag-box">
                        <div :class="'iti-flag ' + item.iso2"></div>
                    </div>
                    <span class="country-name">{{item.name}}</span>
                    <span class="dial-code">{{item.dialCode}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import {allCountries} from './tel-config'

    export default {
        components: {},
        model: {
            prop: 'countryCode',
            event: 'country-code'
        },
        props: {
            countryCode: '',
            them: '',
        },
        data() {
            return {
                allCountries: allCountries,
                currentCountry: '',
                searchText: '',
                showPanel: false,
            }
        },
        computed: {
        },
        watch: {
            countryCode: function () {
                this.selectCountry()
            }
        },
        methods: {
            toggle: function (e) {
                e.stopPropagation()
                this.showPanel = !this.showPanel
                if(this.showPanel){
                    setTimeout(()=>{
                        this.$refs.input.focus()
                    },0)
                }
            },
            handleBodyClick: function () {
                this.showPanel = false
            },
            chooseCountry: function (item,close=false) {
                this.currentCountry = item.iso2
                this.$emit('country-code',item.dialCode)
                if(close){
                    this.showPanel = false
                }
            },
            selectCountry: function () {
                if(this.countryCode === ''){
                    this.chooseCountry(this.allCountries[0])
                }else {
                    this.allCountries.map((item)=>{
                        if(this.countryCode == item.dialCode){
                            this.chooseCountry(item)
                        }
                    })
                }
            },
            keyupdown(type,e){
                let childrens = this.$refs.list.children,len = childrens.length,num = ''
                if(childrens.length==0){
                    return
                }
                for(let i = 0;i<childrens.length;i++){
                    let item = childrens[i]
                    if(item.className.indexOf('highlight') != -1){
                        num = i
                    }
                }
                if(type == 'down'){//按down键情况
                    if(Object.is(num,'')){//如果没有上一次选项，值为0
                        num = 0
                    } else if(num + 1 < len){//如果+1后还有元素，+1
                        num = num+1
                    }else {//其他情况从 0 开始
                        num = 0
                    }
                }else {//按up键情况
                    if(num - 1 >= 0){//如果-1后还有元素，-1
                        num = num - 1
                    }else {//其他情况取最后一个
                        num = len - 1
                    }
                }
                let country = JSON.parse(childrens[num].attributes['data-val'].value)
                this.currentCountry = country.iso2
                this.$emit('country-code',country.dialCode)
                //选择时滚动到选择位置
                this.$refs.list.scrollTop = num*31
            }
        },
        mounted() {
            this.selectCountry()
            this.$nextTick(() => {
                document.querySelector('body').addEventListener('click', this.handleBodyClick);
            })
        },
        beforeDestroy() {
            document.querySelector('body').removeEventListener('click', this.handleBodyClick);
        }
    }
</script>

<style lang="scss" scoped>
    @import "./intl-tel";

    .iti-wrap {
        .iti-con {
            width: 74px;
            height: 46px;
            border: 1px solid #8871FF;
            &:hover{
                border: 1px solid #FFFFFF;
            }
            .iti-flag {
                position: absolute;
                margin-top: 18px;
                margin-left: 20px;
                transform: scale(1.6);
            }
            .iti-panel {
                width: 200px;
                height: 400px;
            }
            .drop-down {
                width: 8px;
                height: 5px;
                margin-left: 55px;
                margin-top: 20px;
            }
            &:hover {
                cursor: pointer;
            }
        }
        .iti-con-white{
            border: 1px solid #DFDFE4;
            &:hover{
                border: 1px solid #9B9B9B;
            }
        }
        .country-list-con {
            width: 450px;
            position: absolute;
            background: #fff;
            .search {
                background: transparent;
                height: 30px;
                outline: none;
                width: 100%;
                text-indent: 10px;
            }
            .country-list {
                position: inherit;
                width: 450px;
                margin: 0;
                &:hover {
                    cursor: pointer;
                }
                li:hover{
                    background-color: rgba(0, 0, 0, 0.05);
                }
            }

        }
    }
</style>


```