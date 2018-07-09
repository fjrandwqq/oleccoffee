<!--
Description
@authors Your Name (you@example.org)
@date    2018-07-08 10:56:27
@version 1.0.0
-->
<template>
  <div id="container">
    百度地图
    <div id="mapDemo">
    </div>
    <div style="color:red">
      你当前的位置:
    </div>
    <div id="lon"></div>
    <div id="address"></div>
     <div style="color:red">
      5公里范围内的公园:
    </div>
    <div id="result"></div>
  </div>
</template>

<script>
import BMap from 'BMap';
export default {
	data() {
		return {
			text: '',
			map: null,
		};
	},
	mounted() {
		var map;
		this.map = map = new BMap.Map('mapDemo');
		map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);

		//浏览器定位
		var geolocation = new BMap.Geolocation();
    var that = this;
    geolocation.enableSDKLocation();
		geolocation.getCurrentPosition(function(r) {
			if (this.getStatus() == BMAP_STATUS_SUCCESS) {
				var mk = new BMap.Marker(r.point);
				map.addOverlay(mk);
        map.panTo(r.point);
        document.getElementById('lon').innerHTML=(r.point.lng+','+r.point.lat);
				that.getName(new BMap.Point(r.point.lng, r.point.lat));
				that.search(new BMap.Point(r.point.lng, r.point.lat));
			} else {
				alert('failed' + this.getStatus());
			}
		});
	},
	methods: {
		getName(point) {
			// 创建地理编码实例
			var myGeo = new BMap.Geocoder();
			// 根据坐标得到地址描述
			myGeo.getLocation(point, function(result) {
				if (result) {
					document.getElementById('address').innerHTML=result.address;
				}
			});
		},
		search(point) {
			var options = {
				onSearchComplete: function(results) {
					if (local.getStatus() == BMAP_STATUS_SUCCESS) {
						// 判断状态是否正确
						var s = [];
						for (var i = 0; i < results.getCurrentNumPois(); i++) {
							s.push(results.getPoi(i).title + ', ' + results.getPoi(i).address);
						}
						document.getElementById('result').innerHTML = s.join('<br>');
					}
				},
			};
			var local = new BMap.LocalSearch(this.map, options);
			local.searchNearby('小区', point, 5000);
		},
	},
};
</script>

<style lang="css" scoped>
</style>
