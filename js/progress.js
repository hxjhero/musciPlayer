(function (root) {
    //进度条
    function Progress() {
        this.durTime = 0;//存取总时长
        this.frameId = null;//定时器
        this.startTime = 0;//开始播放的时间
        this.lastPercent = 0;//暂停时已经走的百分比

        this.init();
    }
    Progress.prototype = {
        init: function () {
            this.getDom();
            this.renderAllTime();
        },
        //获取DOM元素
        getDom: function () {
            this.curTime = document.querySelector('.curTime');
            this.circle = document.querySelector('.circle');
            this.frontBg = document.querySelector('.frontBg');
            this.totalTime = document.querySelector('.totalTime');
        },
        // 渲染总时长
        renderAllTime: function (time) {
            this.durTime = time;//秒数
            time = this.formatTime(time);
            this.totalTime.innerHTML = time;
            // console.log(time);
        },
        //处理总时长的显示格式
        formatTime: function (time) {
            time = Math.round(time);
            var m = Math.floor(time / 60);//分钟
            var s = time % 60;//秒钟 总分钟取模的余数就是剩余的秒数
            m = m < 10 ? '0' + m : m;
            s = s < 10 ? '0' + s : s;
            return m + ':' + s;
        },

        move: function (per) {   //进度条移动
            cancelAnimationFrame(this.frameId);
            this.startTime = new Date().getTime();//按下时记录一个时间点
            var This = this;
            //per为0 不加上一次暂停时的百分比
            this.lastPercent=per===undefined?this.lastPercent:per;

            function frame() {
                var curTime = new Date().getTime();
                var per = This.lastPercent + (curTime - This.startTime) / (This.durTime * 1000);//走的百分比

                if (per <= 1) {
                    //这个条件成立说明当前歌曲还没有播放完
                    This.update(per);
                    // console.log(1)
                } else {
                    // 走到这里说明歌曲已经播放了100%了，停止播放（关掉定时器）
                    cancelAnimationFrame(This.frameId);
                }

                This.frameId = requestAnimationFrame(frame);//关键帧动画代替定时器 底层原理是递归 好处是跟浏览器刷新频率保持一致
            }
            frame();
        },
        update: function (per) {//更新进度条（时间，走的百分比）
            //更新左侧的时间
            var time = this.formatTime(per * this.durTime);
            this.curTime.innerHTML = time;
            // 更新前背景的位置
            this.frontBg.style.width = per * 100 + '%';

            // 更新圆点的位置
            var l = per * this.circle.parentNode.offsetWidth;//小圆点能移动的范围是父级的长度
            this.circle.style.transform = `translateX(${l}px)`;
        },
        stop: function () {//停止进度条
            cancelAnimationFrame(this.frameId);
            var stopTime = new Date().getTime();
            this.lastPercent += (stopTime - this.startTime) / (this.durTime * 1000)//如果不用+=会漏掉一次已播放的时长百分比
        }
    }
    // 实例化
    function instanceProgress() {
        return new Progress();
    }
    //拖拽
    function Drag(obj) {

    }
    Drag.prototype = {

    }
    // 实例化
    function instanceDrag(obj) {
        return new Drag(obj);
    }
    root.progress = {
        pro: instanceProgress,
        drag: instanceDrag,
    }
})(window.player || (window.player = {}))