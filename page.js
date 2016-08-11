// pageJS 

;(function(){
	// 配置
	var options={
		id:'sections',
		points:true
	}
	// 初始状态
	var index=0
	var isScroll=false
	// 配置默认
	var id=options.id
	var points=options.points || false
	var callback=options.callback || null
	// 每个点的描述
	var pointTitles=[]
	// 获取屏幕高度
	var screenHeight=$(window).height();
	// 获取元素
	var sectionBox=$('#'+id)
	var sections=sectionBox.children()
	// 元素个数
	var count=sections.length
	// 获取container offsetTop
	var containerOffTop=sectionBox.offset().top
	// 设置元素高度
	sections.each(function(){
		var $this=$(this);
		$this.height(screenHeight)
		pointTitles.push($this.data('title') || '');
	})
	// 获取页面总高度
	var totalHeight=document.documentElement.scrollHeight
	// 滑动
	function goTo(n,callback){
		isScroll=true;
		index=n;
		$('html,body').animate({"scrollTop":containerOffTop+index*screenHeight},500,function(){
			isScroll=false;
			render(n)
			if(!!callback){
				callback();
			}
		})
	}
	// 前一页
	function back(callback){
		if(index<=0) return;
		index--;
		goTo(index,callback);
	}
	// 后一页
	function next(callback){
		if(index>=count-1) return;
		index++;
		goTo(index,callback);
	}
	// 创建points
	function createPoints(){
		// 创建容器
		var container=$('<div class="sectionPoints">').appendTo($('body'))
		for(var i=0;i<count;i++){
			// 创建点
			var point=$('<span title="'+pointTitles[i]+'"></span>').appendTo(container);
			(function(j){
				point.click(function(){
					goTo(j,callback)
				})
			})(i);
		}
		return container;
	}
	// 存放点容器
	var pointsBox=null
	// 渲染
	function render(n){
		// section
		sections.each(function(i){
			$(this).removeClass('section-active');
			if(i==n){
				$(this).addClass('section-active');
			}
		})
		// points
		if(!!pointsBox){
			pointsBox.find('span').each(function(i){
				$(this).removeClass('point-active')
				if(i==n){
					$(this).addClass('point-active')
				}
			})
		}
	}
	// 事件处理函数
	function scrollHandle(e){
		var delta=(e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
	    (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));
		var sTop=document.documentElement.scrollTop || document.body.scrollTop
	  if(isScroll) return false;
	  if(delta>0){
	  	// 向上滚
	  	if(sTop>containerOffTop+(count-1)*screenHeight){
	  		goTo(count-1,callback)
	  		return;
	  	}
	  	if(sTop<containerOffTop){
	  		$('html,body').stop().animate({'scrollTop':'0'},200)
	  		return;
	  	}
	  	back(callback)
	  }else{
	  	// 向下滚
	  	if(sTop<containerOffTop){
	  		goTo(0,callback)
	  		return;
	  	}
	  	if(sTop>containerOffTop+(count-1)*screenHeight){
	  		$('html,body').stop().animate({'scrollTop':totalHeight-screenHeight},200)
	  		return;
	  	}
	  	next(callback)
	  }
	}
	// 初始化
	function init(){
		// 是否创建点
		if(!!points){
			pointsBox=createPoints();
		}
		// 渲染
		render(0)
		// 刷新返回最顶部
		$('html,body').animate({'scrollTop':'0'},100)
		// 绑定事件
		sectionBox.on('mousewheel DOMMouseScroll',scrollHandle)
	}
	// run
	init();
})()