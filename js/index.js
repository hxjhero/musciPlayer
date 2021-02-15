(function ($, player) {
    function MusicPlayer(dom) {
        this.wrap = dom;//播放器的容器（用于加载listControl模块）
        this.dataList = [];//存储请求到的数据

        // this.now = 1;
        this.indexObj=null;//索引值对象
        this.rotateTimer=null;//旋转唱片定时器
        this.curIndex=0;//当前播放歌曲的索引值
        this.list=null;//列表切歌对象(在listPlay里赋了值)

        this.progress=player.progress.pro();//实例化一个进度条的组件

    }
    MusicPlayer.prototype = {
        init:function() {//初始化
            this.getDom();//获取元素
            this.getData('../mock/data.json');//请求数据
        },
        getDom:function() {//获取页面中的元素
            this.record = document.querySelector('.songImg img');//旋转图片
            this.controlBtns = document.querySelectorAll('.control li');
        },
        getData:function(url) {
            var This = this;
            $.ajax({
                url: url,
                method: "get",
                success: function (data) {
                    This.dataList = data;//存储请求过来的数据

                    This.listPlay();//列表切歌，它要放在loadMusic的前面,因为this.list对象是在这个方法里声明的，要在loadMusic里使用
                    This.indexObj=new player.controlIndex(data.length);//给索引值对象赋值
                    This.loadMusic(This.indexObj.index);//加载音乐
                    This.musicControl();//添加音乐操作功能
                },
                error: function () {
                    console.log("数据请求失败");
                }
            })
        },

        loadMusic:function(index) {//加载音乐
            player.render(this.dataList[index])//渲染图片，歌曲信息，是否喜欢
            player.music.load(this.dataList[index].audioSrc);

            // 加载音乐时渲染总时长
            this.progress.renderAllTime(this.dataList[index].duration);


            // this.list 把列表中的歌曲和正在播放的对应选中状态
            this.list.changeSelect(index);
            this.curIndex=index;//存储当前歌曲对应的索引值


            // 播放音乐（只有音乐当前状态为play时才能播放）
            if (player.music.status == 'play') {
                player.music.play();
                this.imgRotate(0)//旋转图片
            }
        },

        musicControl:function() {//控制音乐（上一首下一首和暂停播放）
            var This = this;
            // 上一首
            this.controlBtns[1].addEventListener('touchend', function () {
                player.music.status = "play"

                // This.now --;
                // This.loadMusic(This.now);//加载上一首音乐

                // This.loadMusic(--This.now);//加载上一首音乐
                This.loadMusic(This.indexObj.prev());//加载上一首音乐
                This.progress.move(0);//切歌时需要让进度条跟着走


            })
            // 播放和暂停
            this.controlBtns[2].addEventListener('touchend', function () {
                if (player.music.status == 'play') {//歌曲状态为播放，点击后要暂停
                    player.music.pause();//歌曲暂停
                    this.className = '';//按钮变成暂停状态
                    This.stopRotate();

                    This.progress.stop();//暂停时进度条停止

                } else {//歌曲状态为暂停，点击后要播放
                    player.music.play();//歌曲播放
                    this.className = 'playing';//按钮变为播放状态

                    //第二次播放时需要加上上一次旋转的角度，但是第一次的时候这个角度是没有的，所以做了一个容错处理
                    var deg = This.record.dataset.rotate || 0;
                    This.imgRotate(deg)//旋转图片

                    This.progress.move();//播放时进度条移动
                }

            })
            // 下一首
            this.controlBtns[3].addEventListener('touchend', function () {
                player.music.status = "play"

                // This.now ++;
                // This.loadMusic(This.now);//加载上一首音乐

                This.loadMusic(This.indexObj.next());//加载上一首音乐
                This.progress.move(0);//切歌时需要让进度条跟着走


            })
        },
        imgRotate:function(deg){//旋转唱片
            var This = this;
            clearInterval(this.rotateTimer);
            this.rotateTimer = setInterval(function(){
                deg = +deg +0.2;//前面的加号是把字符串转成数字
                This.record.style.transform=`rotate(${deg}deg)`;
                This.record.dataset.rotate=deg;
            },1000/60);//电脑刷新频率为一秒60次
        },
        stopRotate:function(){//暂停旋转
            clearInterval(this.rotateTimer);
        },
        listPlay:function(){//列表切歌
            this.list=player.listControl(this.dataList,this.wrap);//把listControl对象赋值给this.list
            var This = this;
            // 给列表按钮添加点击事件
            this.controlBtns[4].addEventListener('touchend',function(){
                This.list.slideUp();
            });
            //歌曲列表添加事件
            this.list.musicList.forEach(function(item,index) {
                //如果点击的是当前的那首歌，不管它是播放还是暂停都无效
                item.addEventListener('touchend',function(){
                    if(This.curIndex == index){
                        return;
                    }
                    // 重新加载音乐
                    player.music.status='play';//歌曲变为播放状态
                    This.indexObj.index=index;//索引值对象身上的当前索引值要更新 更新为点击后的索引
                    This.loadMusic(index);//加载点击对应的索引值的那首歌曲
                    This.list.slideDown();//列表消失
                })
            });
        }
    }
    var musicPlayer = new MusicPlayer(document.getElementById('wrap'));
    musicPlayer.init();
})(window.Zepto, window.player)