/*
 Highcharts JS v11.0.1 (2023-05-08)

 Pictorial graph series type for Highcharts

 (c) 2010-2022 Torstein Honsi, Magdalena Gut

 License: www.highcharts.com/license
*/
'use strict';(function(a){"object"===typeof module&&module.exports?(a["default"]=a,module.exports=a):"function"===typeof define&&define.amd?define("highcharts/modules/pictorial",["highcharts"],function(l){a(l);a.Highcharts=l;return a}):a("undefined"!==typeof Highcharts?Highcharts:void 0)})(function(a){function l(a,k,v,g){a.hasOwnProperty(k)||(a[k]=g.apply(null,v),"function"===typeof CustomEvent&&window.dispatchEvent(new CustomEvent("HighchartsModuleLoaded",{detail:{path:k,module:a[k]}})))}a=a?a._modules:
{};l(a,"Extensions/PatternFill.js",[a["Core/Animation/AnimationUtilities.js"],a["Core/Chart/Chart.js"],a["Core/Globals.js"],a["Core/Defaults.js"],a["Core/Series/Point.js"],a["Core/Series/Series.js"],a["Core/Renderer/SVG/SVGRenderer.js"],a["Core/Utilities.js"]],function(a,k,v,g,z,n,d,e){function m(b,c){b=JSON.stringify(b);var a=b.length||0,f=0,h=0;if(c){c=Math.max(Math.floor(a/500),1);for(var u=0;u<a;u+=c)f+=b.charCodeAt(u);f&=f}for(;h<a;++h)c=b.charCodeAt(h),f=(f<<5)-f+c,f&=f;return f.toString(16).replace("-",
"1")}var q=a.animObject,r=g.getOptions;a=e.addEvent;var l=e.defined,C=e.erase,w=e.merge,x=e.pick,A=e.removeEvent;g=e.wrap;var B=v.patterns=function(){var b=[],c=r().colors;["M 0 0 L 5 5 M 4.5 -0.5 L 5.5 0.5 M -0.5 4.5 L 0.5 5.5","M 0 5 L 5 0 M -0.5 0.5 L 0.5 -0.5 M 4.5 5.5 L 5.5 4.5","M 2 0 L 2 5 M 4 0 L 4 5","M 0 2 L 5 2 M 0 4 L 5 4","M 0 1.5 L 2.5 1.5 L 2.5 0 M 2.5 5 L 2.5 3.5 L 5 3.5"].forEach(function(a,f){b.push({path:a,color:c[f],width:5,height:5,patternTransform:"scale(1.4 1.4)"})});["M 0 0 L 5 10 L 10 0",
"M 3 3 L 8 3 L 8 8 L 3 8 Z","M 5 5 m -4 0 a 4 4 0 1 1 8 0 a 4 4 0 1 1 -8 0","M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11","M 0 10 L 10 0 M -1 1 L 1 -1 M 9 11 L 11 9"].forEach(function(a,f){b.push({path:a,color:c[f+5],width:10,height:10})});return b}();z.prototype.calculatePatternDimensions=function(b){if(!b.width||!b.height){var c=this.graphic&&(this.graphic.getBBox&&this.graphic.getBBox(!0)||this.graphic.element&&this.graphic.element.getBBox())||{},a=this.shapeArgs;a&&(c.width=a.width||c.width,c.height=
a.height||c.height,c.x=a.x||c.x,c.y=a.y||c.y);if(b.image){if(!c.width||!c.height){b._width="defer";b._height="defer";c=this.series.chart.mapView&&this.series.chart.mapView.getSVGTransform().scaleY;l(c)&&0>c&&(b._inverted=!0);return}b.aspectRatio&&(c.aspectRatio=c.width/c.height,b.aspectRatio>c.aspectRatio?c.aspectWidth=c.height*b.aspectRatio:c.aspectHeight=c.width/b.aspectRatio);b._width=b.width||Math.ceil(c.aspectWidth||c.width);b._height=b.height||Math.ceil(c.aspectHeight||c.height)}b.width||(b._x=
b.x||0,b._x+=c.x-Math.round(c.aspectWidth?Math.abs(c.aspectWidth-c.width)/2:0));b.height||(b._y=b.y||0,b._y+=c.y-Math.round(c.aspectHeight?Math.abs(c.aspectHeight-c.height)/2:0))}};d.prototype.addPattern=function(b,c){c=x(c,!0);var a=q(c),f=b.width||b._width||32,h=b.height||b._height||32,u=b.color||"#343434",t=b.id,E=this,y=function(b){E.rect(0,0,f,h).attr({fill:b}).add(d)};t||(this.idCounter=this.idCounter||0,t="highcharts-pattern-"+this.idCounter+"-"+(this.chartIndex||0),++this.idCounter);this.forExport&&
(t+="-export");this.defIds=this.defIds||[];if(!(-1<this.defIds.indexOf(t))){this.defIds.push(t);var p={id:t,patternUnits:"userSpaceOnUse",patternContentUnits:b.patternContentUnits||"userSpaceOnUse",width:f,height:h,x:b._x||b.x||0,y:b._y||b.y||0};b._inverted&&(p.patternTransform="scale(1, -1)",b.patternTransform&&(b.patternTransform+=" scale(1, -1)"));b.patternTransform&&(p.patternTransform=b.patternTransform);var d=this.createElement("pattern").attr(p).add(this.defs);d.id=t;b.path?(p=e.isObject(b.path)?
b.path:{d:b.path},b.backgroundColor&&y(b.backgroundColor),y={d:p.d},this.styledMode||(y.stroke=p.stroke||u,y["stroke-width"]=x(p.strokeWidth,2),y.fill=p.fill||"none"),p.transform&&(y.transform=p.transform),this.createElement("path").attr(y).add(d),d.color=u):b.image&&(c?this.image(b.image,0,0,f,h,function(){this.animate({opacity:x(b.opacity,1)},a);A(this.element,"load")}).attr({opacity:0}).add(d):this.image(b.image,0,0,f,h).add(d));b.image&&c||"undefined"===typeof b.opacity||[].forEach.call(d.element.childNodes,
function(f){f.setAttribute("opacity",b.opacity)});this.patternElements=this.patternElements||{};return this.patternElements[t]=d}};g(n.prototype,"getColor",function(b){var c=this.options.color;c&&c.pattern&&!c.pattern.color?(delete this.options.color,b.apply(this,Array.prototype.slice.call(arguments,1)),c.pattern.color=this.color,this.color=this.options.color=c):b.apply(this,Array.prototype.slice.call(arguments,1))});a(n,"render",function(){var b=this.chart.isResizing;(this.isDirtyData||b||!this.chart.hasRendered)&&
(this.points||[]).forEach(function(c){var a=c.options&&c.options.color;a&&a.pattern&&(!b||c.shapeArgs&&c.shapeArgs.width&&c.shapeArgs.height?c.calculatePatternDimensions(a.pattern):(a.pattern._width="defer",a.pattern._height="defer"))})});a(z,"afterInit",function(){var b=this.options.color;b&&b.pattern&&("string"===typeof b.pattern.path&&(b.pattern.path={d:b.pattern.path}),this.color=this.options.color=w(this.series.options.color,b))});a(d,"complexColor",function(b){var c=b.args[0],a=b.args[1];b=
b.args[2];var f=this.chartIndex||0,h=c.pattern,u="#343434";"undefined"!==typeof c.patternIndex&&B&&(h=B[c.patternIndex]);if(!h)return!0;if(h.image||"string"===typeof h.path||h.path&&h.path.d){var t=b.parentNode&&b.parentNode.getAttribute("class");t=t&&-1<t.indexOf("highcharts-legend");"defer"!==h._width&&"defer"!==h._height||z.prototype.calculatePatternDimensions.call({graphic:{element:b}},h);if(t||!h.id)h=w({},h),h.id="highcharts-pattern-"+f+"-"+m(h)+m(h,!0);this.addPattern(h,!this.forExport&&x(h.animation,
this.globalAnimation,{duration:100}));u="url(".concat(this.url,"#").concat(h.id+(this.forExport?"-export":""),")")}else u=h.color||u;b.setAttribute(a,u);c.toString=function(){return u};return!1});a(k,"endResize",function(){(this.renderer&&this.renderer.defIds||[]).filter(function(b){return b&&b.indexOf&&0===b.indexOf("highcharts-pattern-")}).length&&(this.series.forEach(function(b){b.visible&&b.points.forEach(function(b){(b=b.options&&b.options.color)&&b.pattern&&(b.pattern._width="defer",b.pattern._height=
"defer")})}),this.redraw(!1))});a(k,"redraw",function(){var b={},c=this.renderer,a=(c.defIds||[]).filter(function(b){return b.indexOf&&0===b.indexOf("highcharts-pattern-")});a.length&&([].forEach.call(this.renderTo.querySelectorAll('[color^="url("], [fill^="url("], [stroke^="url("]'),function(f){if(f=f.getAttribute("fill")||f.getAttribute("color")||f.getAttribute("stroke"))f=f.replace(c.url,"").replace("url(#","").replace(")",""),b[f]=!0}),a.forEach(function(f){b[f]||(C(c.defIds,f),c.patternElements[f]&&
(c.patternElements[f].destroy(),delete c.patternElements[f]))}))});""});l(a,"Series/Pictorial/PictorialUtilities.js",[a["Core/Utilities.js"]],function(a){var k=a.defined;return{rescalePatternFill:function(a,g,k,n,d){void 0===d&&(d=1);var e=a&&a.attr("fill");if(e=e&&e.match(/url\(([^)]+)\)/))if(e=document.querySelector("".concat(e[1]," path"))){var m=e.getBBox();if(0===m.width){var q=e.parentElement;a.renderer.box.appendChild(e);m=e.getBBox();q.appendChild(e)}a=1/(m.width+d);n=g/n/m.height;q=m.width/
m.height;g=k/g;var v=-m.width/2;q<g&&(a=a*q/g);e.setAttribute("stroke-width",d/(k*a));e.setAttribute("transform","translate(0.5, 0)"+"scale(".concat(a," ").concat(n,") ")+"translate(".concat(v+d*a/2,", ").concat(-m.y,")"))}},invertShadowGroup:function(a,g){(g=g.chart.inverted)&&a.attr({rotation:g?90:0,scaleX:g?-1:1})},getStackMetrics:function(a,g){var r=a.len,n=0;g&&k(g.max)&&(n=a.toPixels(g.max,!0),r=a.len-n);return{height:r,y:n}}}});l(a,"Series/Pictorial/PictorialPoint.js",[a["Core/Series/SeriesRegistry.js"],
a["Series/Pictorial/PictorialUtilities.js"]],function(a,k){var r=this&&this.__extends||function(){var a=function(d,e){a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(a,e){a.__proto__=e}||function(a,e){for(var d in e)Object.prototype.hasOwnProperty.call(e,d)&&(a[d]=e[d])};return a(d,e)};return function(d,e){function g(){this.constructor=d}if("function"!==typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");a(d,e);d.prototype=null===
e?Object.create(e):(g.prototype=e.prototype,new g)}}(),g=k.rescalePatternFill,l=k.getStackMetrics;return function(a){function d(){var e=null!==a&&a.apply(this,arguments)||this;e.options=void 0;e.series=void 0;e.pathDef=void 0;return e}r(d,a);d.prototype.setState=function(){a.prototype.setState.apply(this,arguments);var e=this.series,d=e.options.paths;this.graphic&&this.shapeArgs&&d&&g(this.graphic,l(e.yAxis,d[this.index%d.length]).height,this.shapeArgs.width||0,this.shapeArgs.height||Infinity,this.series.options.borderWidth||
0)};return d}(a.seriesTypes.column.prototype.pointClass)});l(a,"Series/Pictorial/PictorialSeries.js",[a["Core/Animation/AnimationUtilities.js"],a["Core/Chart/Chart.js"],a["Series/Pictorial/PictorialPoint.js"],a["Series/Pictorial/PictorialUtilities.js"],a["Core/Series/SeriesRegistry.js"],a["Core/Axis/Stacking/StackItem.js"],a["Core/Utilities.js"]],function(a,k,l,g,z,n,d){function e(a){var b=Object.keys(a.points).filter(function(a){return 1<a.split(",").length}),c=a.axis.chart.series,f=-1;b.map(function(a){return parseFloat(a.split(",")[0])}).forEach(function(a){c[a]&&
c[a].visible&&(f=a)});if((b=a.axis.chart.series[f])&&b.is("pictorial")&&a.axis.hasData()&&b.xAxis.hasData()){var e=b.xAxis,d=a.axis.options,p=a.axis.chart,g=a.shadow,k=e.toPixels(a.x,!0);k=p.inverted?e.len-k:k;var l=b.options.paths||[],m=l[a.x%l.length];l=b.getColumnMetrics&&b.getColumnMetrics().width;var n=w(b.yAxis,m),q=n.height;n=n.y;var r=d.stackShadow;d=D(r&&r.borderWidth,b.options.borderWidth,1);!g&&r&&r.enabled&&m?(a.shadowGroup||(a.shadowGroup=p.renderer.g("shadow-group").add()),a.shadowGroup.attr({translateX:p.inverted?
a.axis.pos:e.pos,translateY:p.inverted?e.pos:a.axis.pos}),a.shadow=p.renderer.rect(k,n,l,q).attr({fill:{pattern:{path:{d:m.definition,fill:r.color||"#dedede",strokeWidth:d,stroke:r.borderColor||"transparent"},x:k,y:n,width:l,height:q,patternContentUnits:"objectBoundingBox",backgroundColor:"none",color:"#dedede"}}}).add(a.shadowGroup),x(a.shadowGroup,a.axis),A(a.shadow,q,l,q,d),a.setOffset(b.pointXOffset||0,b.barW||0)):g&&a.shadowGroup&&(g.animate({x:k,y:n,width:l,height:q}),m=/url\(([^)]+)\)/,(m=
(r=g.attr("fill"))&&r.match(m))&&p.renderer.patternElements&&p.renderer.patternElements[m[1].slice(1)].animate({x:k,y:n,width:l,height:q}),a.shadowGroup.animate({translateX:p.inverted?a.axis.pos:e.pos,translateY:p.inverted?e.pos:a.axis.pos}),x(a.shadowGroup,a.axis),A(g,q,l,q,d),a.setOffset(b.pointXOffset||0,b.barW||0))}else a.shadow&&a.shadowGroup&&(a.shadow.destroy(),a.shadow=void 0,a.shadowGroup.destroy(),a.shadowGroup=void 0)}function m(a,b){a.axes&&a.axes.forEach(function(a){a.stacking&&c(a.stacking.stacks,
function(a){c(a,function(a){b(a)})})})}function q(a){m(a,function(a){a.shadow&&a.shadowGroup&&(a.shadow.destroy(),a.shadowGroup.destroy(),delete a.shadow,delete a.shadowGroup)})}var r=this&&this.__extends||function(){var a=function(b,c){a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(a,b){a.__proto__=b}||function(a,b){for(var c in b)Object.prototype.hasOwnProperty.call(b,c)&&(a[c]=b[c])};return a(b,c)};return function(b,c){function f(){this.constructor=b}if("function"!==typeof c&&
null!==c)throw new TypeError("Class extends value "+String(c)+" is not a constructor or null");a(b,c);b.prototype=null===c?Object.create(c):(f.prototype=c.prototype,new f)}}(),v=z.seriesTypes.column,C=a.animObject,w=g.getStackMetrics,x=g.invertShadowGroup,A=g.rescalePatternFill;a=d.addEvent;var B=d.defined,b=d.merge,c=d.objectEach,D=d.pick;d=function(a){function c(){var b=null!==a&&a.apply(this,arguments)||this;b.paths=void 0;b.data=void 0;b.options=void 0;b.points=void 0;return b}r(c,a);c.prototype.animate=
function(a){var b=this.chart,c=this.group,f=C(this.options.animation),e=[this.getSharedClipKey(),f.duration,f.easing,f.defer].join(),d=b.sharedClips[e];a&&c?(f=this.getClipBox(),d||(f.y=f.height,f.height=0,d=b.renderer.clipRect(f),b.sharedClips[e]=d),c.clip(d)):d&&!d.hasClass("highcharts-animating")&&(b=this.getClipBox(),d.addClass("highcharts-animating").animate(b,f))};c.prototype.animateDrilldown=function(){};c.prototype.animateDrillupFrom=function(){};c.prototype.pointAttribs=function(b){var c=
a.prototype.pointAttribs.apply(this,arguments),f=this.options.paths;if(b&&b.shapeArgs&&f){var d=f[b.index%f.length],e=w(this.yAxis,d);f=e.y;e=e.height;d=d.definition;d!==b.pathDef?(b.pathDef=d,c.fill={pattern:{path:{d,fill:c.fill,strokeWidth:c["stroke-width"],stroke:c.stroke},x:b.shapeArgs.x,y:f,width:b.shapeArgs.width||0,height:e,patternContentUnits:"objectBoundingBox",backgroundColor:"none",color:"#ff0000"}}):b.pathDef&&b.graphic&&delete c.fill}delete c.stroke;delete c.strokeWidth;return c};c.prototype.getExtremes=
function(){var b=a.prototype.getExtremes.apply(this,arguments),c=this.options.paths;c&&c.forEach(function(a){B(a.max)&&B(b.dataMax)&&a.max>b.dataMax&&(b.dataMax=a.max)});return b};c.defaultOptions=b(v.defaultOptions,{borderWidth:0});return c}(v);a(d,"afterRender",function(){var a=this,b=a.options.paths,c=/url\(([^)]+)\)/;a.points.forEach(function(d){if(d.graphic&&d.shapeArgs&&b){var f=b[d.index%b.length],e=d.graphic.attr("fill"),g=e&&e.match(c),h=w(a.yAxis,f);e=h.y;h=h.height;g&&a.chart.renderer.patternElements&&
(g=a.chart.renderer.patternElements[g[1].slice(1)])&&g.animate({x:d.shapeArgs.x,y:e,width:d.shapeArgs.width||0,height:h});A(d.graphic,w(a.yAxis,f).height,d.shapeArgs.width||0,d.shapeArgs.height||Infinity,a.options.borderWidth||0)}})});a(k,"render",function(){m(this,e)});a(n,"afterSetOffset",function(a){if(this.shadow){var b=this.axis,c=b.chart;b=b.len;var d=a.xOffset;a=a.width;this.shadow.attr({translateX:c.inverted?d-c.xAxis[0].len:d,translateY:c.inverted?-b:0});this.shadow.animate({width:a})}});
a(k,"afterDrilldown",function(a){q(this)});a(k,"afterDrillUp",function(a){q(this)});d.prototype.pointClass=l;z.registerSeriesType("pictorial",d);"";return d});l(a,"masters/modules/pictorial.src.js",[],function(){})});
//# sourceMappingURL=pictorial.js.map