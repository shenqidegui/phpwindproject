/*!
 * PHPWind PAGE JS
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ϲ���ٲ���Ч��
 * @Author	: wengqianshan@me.com
 * @Depend	: jquery.js(1.7 or later), like.js
 * $Id: like_index.js 5804 2012-03-12 08:58:35Z hao.lin $
 */
;
(function () {
    var LikeFall = function(options){
            this.container = options.container;
            this.url = options.url;
            this.param = options.param || {};
            this.firstLoaded = options.firstLoaded;//��һ�μ����������
            this.allLoaded = options.allLoaded;//�������ݼ������
            this.RenderComplete = options.RenderComplete;//ÿ����Ⱦ���
            this.loadFailed = options.loadFailed;//����ʧ��
            this.start = 0;
            this.getNum = 20;
            this.maxTimes = 5;
            this.isLoading = false;
            this.dis = options.dis || 100;
            this.template =options.template || '<div class="box">\
                    <% if(thumb!=""){%>\
                    <div class="img"><a href="<%=url%>"><img src="<%=thumb%>" width="200"></a></div>\
                    <%}%>\
                    <div class="descrip"><%=intro%><a href="<%=url%>">����&gt;&gt;</a></div>\
                        <dl class="user">\
                        <% if(avatar_n!=""){%>\
                            <dt><%=avatar_n%></dt>\
                        <%}%>\
                            <dd>\
                                <p class="name"><a href="<%=space%>"><%=author%></a></p>\
                                <p class="time"><%=threadTime%></p>\
                            </dd>\
                        </dl>\
                    <a class="num J_like_btn" role="button" tabindex="0" title="�����ӵ��ҵ�ϲ��" href="' + LIKE_PLUS + '" data-role="hot"><em class="J_like_count"><%=like%></em></a>\
                </div>';
        };
        LikeFall.prototype = {
            init: function(){
                var _this = this;
                //ҳ������¼�
                var windowHeight = $(window).height(),
                        _this = this,
                        timer = false;
                $(window).scroll(function () {
                    //������Ƿ����
                    if($("#J_like_detect").length < 1){
                        return;
                    }
                    var scrollTop = $(document).scrollTop(),
                        scrollHeight = $(document).height(),
                        detectTop = $("#J_like_detect").offset().top;
                    //��ֹ����ʱ�������
                    if (timer) {
                        clearTimeout(timer)
                    }
                    if(_this.isLoading === true){
                        //���ڼ���
                        return;
                    }
                    timer = setTimeout(function () {
                        if (windowHeight + scrollTop > detectTop + _this.dis) {
                            _this.render();
                        }
                    }, 200)
                });

                this.render();
            },
            render: function(){
                var _this = this;
                if (this.start < this.maxTimes) {
                    this.start++;
                    //ɾ�����
                    if($("#J_like_detect").length){
                        $("#J_like_detect").remove();
                    }
                    this.getData(function(result){
                        $.each(result, function (i, o) {
                            var ele = result[i];
                            var html = Wind.tmpl(_this.template, ele).replace(/_KEY/g, o.fromid).replace(/_FROMTYPE/g, o.fromtype); //�滻ģ��
                            html = $(html);
                            _this.RenderComplete && _this.RenderComplete(html);
                        });
                        //���һ�����
                        var _html = $(_this.template).attr("id", "J_like_detect").css({
                            padding: 0,
                            border: 'none',
                            margin: 0
                        }).empty();
                        setTimeout(function(){
                            _this.RenderComplete && _this.RenderComplete(_html);
                        }, 1000);
                        //
                        if(_this.start === 1){
                            _this.firstLoaded && _this.firstLoaded(result);
                        }
                    });
                    
                }else if(this.start == this.maxTimes){
                    this.allLoaded && this.allLoaded();
                }
            },
            getData: function(callback){
                var _this = this;
                this.param['start'] = (this.start-1) * this.getNum;
                this.param['_rand'] = + new Date();

                if(_this.start > 1){
                    $("#J_loading").show();
                }
                _this.isLoading = true;
                
                $.ajax({
                        type: "get",
                        url: this.url,
                        dataType: 'json',
                        data: this.param,
                        success: function (data) {
                            _this.isLoading = false;
                            var state = data.state;
                            if(state == 'success'){
                                var result = data.html;
                                callback && callback(result);
                                if (!result || result.length < 1) {
                                	$("#J_loading").hide();
                                    $(window).unbind('scroll');
                                }
                            }else{
                                _this.loadFailed && _this.loadFailed();
                                Wind.Util.resultTip({
                                    error: true,
                                    msg: data.message,
                                    follow: false
                                });
                                $(window).unbind('scroll');
                            }
                            
                        },
                        complete: function () {
                            //$("#J_loading").hide();
                        },
                        error: function (result) {
                            _this.loadFailed && _this.loadFailed();
                            Wind.Util.resultTip({
                                error: true,
                                msg: '������æ�����Ժ�����!',
                                follow: false
                            });
                        }
                    })
            }
        };
    window.LikeFall = LikeFall;
})();