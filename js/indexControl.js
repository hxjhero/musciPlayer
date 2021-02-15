(function (root) {
    function Index(len) {
        this.index = 0;//当前的索引值
        this.len = len;//数据的长度，用于做判断
    }
    Index.prototype = {
        //两个边界用一个条件处理 get函数接收一个参数,参数(1或-1)表示切到上一首或下一首，里面的条件判断边界，另外两个函数调用get函数

        // 这个方法用来取上一个索引（上一首）
        prev: function () {
            return this.get(-1);//切到上一首
        },
        // 这个方法用来取下一个索引（下一首）
        next: function () {
            return this.get(1);//切到下一首
        },
        // 用来获取索引，参数为1或-1
        get: function (val) {
            // 当索引值为0时是左边界，再切到上一首索引值就变为this.len-1(最后一首)；当索引值为this.len-1时是右边界，再切到下一首索引值就变为0；
            this.index = (this.index + val + this.len) % this.len;  //10%21-->10 对一个比自己大的数取模得到是自己 判断右边界式子可变为(this.index+val)%this.len+(this.len%this.len) 取模的意义在于循环
            return this.index;
        }
    }
    root.controlIndex = Index;//把构造函数暴露出去，因为实例对象需要传参，所以实例对象不能暴露出去
})(window.player || (window.player = {}))