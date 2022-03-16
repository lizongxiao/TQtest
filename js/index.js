window.addEventListener('load', function() {
    //设置导航栏点击选中状态
    var nav = this.document.querySelector('.main_nav');
    //循环绑定鼠标经过、离开、点击事件
    for (var i = 0; i < nav.children.length; i++) {
        nav.children[i].addEventListener('mouseenter', function() {
            this.className = 'navStyle'
        })
        nav.children[i].addEventListener('mouseleave', function() {
            this.className = ''
        })
        nav.children[i].addEventListener('click', function() {
            for (var i = 0; i < nav.children.length; i++) {
                nav.children[i].id = ''
            }
            this.id = 'navStyle'
        })
    }
    //获取轮播图和按钮,并设置鼠标经过显示，移开鼠标隐藏
    var pre_btn = this.document.querySelector('.pre')
    var next_btn = this.document.querySelector('.next')
    var focus = this.document.querySelector('.main_carousel')
    var ul = focus.querySelector('ul');
    //拿到图片宽度
    var li = ul.querySelector('li')
    var imgWidth = li.offsetWidth;
    // console.log(imgWidth);
    var ol = focus.querySelector('ol');
    focus.addEventListener('mouseenter', function() {
        pre_btn.style.display = "block"
        next_btn.style.display = "block"
        clearInterval(timer);
        timer = null; // 清除定时器变量

    })
    focus.addEventListener('mouseleave', function() {
            pre_btn.style.display = "none"
            next_btn.style.display = "none"
            timer = setInterval(function() {
                //自动调用右侧按钮点击事件
                next_btn.click();
            }, 2000);
        })
        //按照轮播图图片数量，生成小圆圈
    for (var i = 0; i < ul.children.length; i++) {
        //生成li
        var li = document.createElement('li');
        //同时表明索引号
        li.setAttribute('index', i)
            //把li放进ol
        ol.appendChild(li)
        li.addEventListener('click', function() {
            //绑定点击事件，排他思想
            for (var i = 0; i < ol.children.length; i++) {
                ol.children[i].id = ''
            }
            //点击哪个li就设置选中样式
            this.id = 'current'
                //拿到li的index
            var index = this.getAttribute('index')
            console.log(index);
            //使用封装的移动函数，传入参数为移动对象，移动距离=图片宽度*索引号，回调函数
            animate(ul, -index * imgWidth)
        })
    }
    //默认为第1个li选中
    ol.children[0].id = 'current'
        //克隆第一张图片，让其实现无缝滚动
    var imgclone = ul.children[0].cloneNode(true);
    ul.appendChild(imgclone);
    //左右按钮绑定点击事件，切换图片位置
    var num = 0;
    // circle 控制小圆圈的播放
    var circle = 0;
    // flag 节流阀
    var flag = true;
    next_btn.addEventListener('click', function() {
        if (flag) {
            flag = false; // 关闭节流阀
            // 如果走到了最后复制的一张图片，此时 我们的ul 要快速复原 left 改为 0
            if (num == ul.children.length - 1) {
                ul.style.left = 0;
                num = 0;
            }
            num++;
            animate(ul, -num * imgWidth, function() {
                flag = true; // 打开节流阀
            });
            // 8. 点击右侧按钮，小圆圈跟随一起变化 可以再声明一个变量控制小圆圈的播放
            circle++;
            // 如果circle == 4 说明走到最后我们克隆的这张图片了 我们就复原
            if (circle == ol.children.length) {
                circle = 0;
            }
            // 调用函数
            circleChange();
        }
    })
    pre_btn.addEventListener('click', function() {
        if (flag) {
            flag = false;
            if (num == 0) {
                num = ul.children.length - 1;
                ul.style.left = -num * imgWidth + 'px';

            }
            num--;
            animate(ul, -num * imgWidth, function() {
                flag = true;
            });
            // 点击左侧按钮，小圆圈跟随一起变化 可以再声明一个变量控制小圆圈的播放
            circle--;
            // 如果circle < 0  说明第一张图片，则小圆圈要改为第4个小圆圈（3）
            // if (circle < 0) {
            //     circle = ol.children.length - 1;
            // }
            circle = circle < 0 ? ol.children.length - 1 : circle;
            // 调用函数
            circleChange();
        }
    });

    function circleChange() {
        // 先清除其余小圆圈的current类名
        for (var i = 0; i < ol.children.length; i++) {
            ol.children[i].id = '';
        }
        // 留下当前的小圆圈的current类名
        ol.children[circle].id = 'current';
    }
    // 10. 自动播放轮播图 页面加载自动点击右侧按钮
    var timer = setInterval(function() {
        //手动调用点击事件
        next_btn.click();
    }, 2000);




    //xmlhttprequest对象请求数据
    var str1 = '';
    //存放横轴
    var arr2 = [];
    //存放纵轴
    var arr3 = [];
    // 1. 创建XMLHttpRequest对象
    const xhr1 = new XMLHttpRequest()
        // 2. 打开一个http请求
    xhr1.open("GET", " https://edu.telking.com/api/?type=month", true)
    xhr1.setRequestHeader("Token", "Bearer") // 设置http请求头（按需设置）
        // xhr.withCredentials = true // 跨域请求需要带授权信息
        // 3. 添加响应http请求的状态变化的函数
    xhr1.onreadystatechange = async function() {
            // console.log(xhr.readyState) // 监听readyState的变化
            if (xhr1.readyState === xhr1.DONE) {
                //    console.log(xhr.status) // 获取到http请求返回的状态码
                // console.log(xhr.response) // 获取http请求返回的数据
                str1 = xhr1.response;
                //处理返回数据 横轴
                var pos1 = str1.indexOf("xAxis");
                var pos2 = str1.indexOf("],");
                let res = str1.slice(pos1 + 9, pos2);
                var arr1 = res.split(',');
                for (var i = 0; i < arr1.length; i++) {
                    if (i == 0) {
                        arr2.push(arr1[i].slice(1, 6))
                    } else {
                        arr2.push(arr1[i].slice(2, 7))
                    }
                }
                //处理返回数据 纵轴
                var pos3 = str1.indexOf("series");
                var pos4 = str1.indexOf("]}");
                var res2 = str1.slice(pos3 + 10, pos4);
                var arr4 = res2.split(',');
                for (var i = 0; i < arr4.length; i++) {
                    if (i == 0) {
                        arr3.push(arr4[i].slice(0, 6))
                    } else {
                        arr3.push(arr4[i].slice(1, 7))
                    }
                }


            }

        }
        // 4. 发送http请求
    xhr1.send()
        // console.log(arr2);
        // console.log(arr3);
        //设置定时器 
    setInterval(getdata1, 2000);
    //需要间隔时间设置option数据
    function getdata1() {
        option_line.xAxis.data = arr2
        option_line.series[0].data = arr3
        echarts_line.setOption(option_line);
    }
    // echarts曲线图
    var echarts_line = echarts.init(document.querySelector('.echarts_line'));
    var option_line;
    // 指定图表的配置项和数据
    option_line = {
        title: {
            text: "曲线图数据展示"
        },
        grid: {
            height: "70%",
            width: "80%"
        },
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            smooth: true,
            data: [],
            type: 'line',
            label: {
                show: true,
                position: 'right',
                textStyle: {
                    fontSize: 10
                }
            }
        }]
    };
    // 使用刚指定的配置项和数据显示图表。
    echarts_line.setOption(option_line);
    //响应式图表大小
    window.onresize = function() {
        echarts_line.resize();
    };


    //饼形图请求数据

    //xmlhttprequest对象请求数据
    var str2 = '';
    //存放横轴
    var arr5 = [];
    //存放纵轴
    var arr6 = [];
    // 1. 创建XMLHttpRequest对象
    const xhr2 = new XMLHttpRequest()
        // 2. 打开一个http请求
    xhr2.open("GET", " https://edu.telking.com/api/?type=week", true)
    xhr2.setRequestHeader("Token", "Bearer") // 设置http请求头（按需设置）
        // xhr.withCredentials = true // 跨域请求需要带授权信息
        // 3. 添加响应http请求的状态变化的函数
    xhr2.onreadystatechange = async function() {
        // console.log(xhr.readyState) // 监听readyState的变化
        if (xhr2.readyState === xhr2.DONE) {
            // console.log(xhr2.status) // 获取到http请求返回的状态码
            // console.log(xhr2.response) // 获取http请求返回的数据
            str2 = xhr2.response;
            //处理返回数据 横轴
            let pos3 = str2.indexOf("xAxis");
            let pos4 = str2.indexOf("],");
            let res3 = str2.slice(pos3 + 9, pos4);
            let arr7 = res3.split(',');
            for (let i = 0; i < arr7.length; i++) {
                if (i == 0) {
                    arr5.push(arr7[i].slice(1, 4))
                } else {
                    arr5.push(arr7[i].slice(2, 5))
                }
            }
            //处理返回数据 纵轴
            let pos5 = str2.indexOf("series");
            let pos6 = str2.indexOf("]}");
            let res4 = str2.slice(pos5 + 10, pos6);
            let arr8 = res4.split(',');
            for (var i = 0; i < arr8.length; i++) {
                if (i == 0) {
                    arr6.push(arr8[i].slice(0, 4))
                } else {
                    arr6.push(arr8[i].slice(1, 6))
                }
            }


        }

    }


    // 4. 发送http请求
    xhr2.send()

    // 饼状图
    var echarts_pie = echarts.init(document.querySelector('.echarts_pie'));
    // 指定图表的配置项和数据
    var option_pie = {
        title: {
            text: '饼形图展示'
        },
        series: [{
            // data中的数据需要先创建好对应的对象  
            type: 'pie',

            data: [{
                    value: '',
                    name: ''
                },
                {
                    value: '',
                    name: ''
                },
                {
                    value: '',
                    name: ''
                },
                {
                    value: '',
                    name: ''
                },
                {
                    value: '',
                    name: ''
                },
                {
                    value: '',
                    name: ''
                },
                {
                    value: '',
                    name: ''
                },

            ],
            radius: '50%'
        }]
    };
    // 使用刚指定的配置项和数据显示图表。
    echarts_pie.setOption(option_pie);
    //响应式图表大小
    window.onresize = function() {
        echarts_pie.resize();
    };

    //间隔时间设置option数据
    function getdata2() {
        for (var i = 0; i < arr5.length; i++) {
            option_pie.series[0].data[i].name = arr5[i]
            option_pie.series[0].data[i].value = arr6[i]

        }
        echarts_pie.setOption(option_pie);

    }
    //设置定时器
    setInterval(getdata2, 2000);
    // console.log(arr5);
    // console.log(arr6);




    // 柱状图
    var echarts_bar = echarts.init(document.querySelector('.echarts_bar'));
    // 指定图表的配置项和数据
    var option_bar = {
        title: {
            text: '柱状图数据展示'
        },
        tooltip: {},
        legend: {
            data: ['数据']
        },
        xAxis: {
            data: []
        },
        yAxis: {
            // data: ['']
        },
        series: [{
            name: '数据',
            type: 'bar',
            data: []
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    echarts_bar.setOption(option_bar);
    //响应式图表大小
    window.onresize = function() {
        echarts_bar.resize();
    };


    //间隔时间设置option数据
    function getdata3() {
        option_bar.xAxis.data = arr5
        option_bar.series[0].data = arr6
        echarts_bar.setOption(option_bar);

    }
    //设置定时器
    setInterval(getdata3, 2000);
})