/**
 * Created by caoyx on 2017/5/15 0015.
 */
$(document).ready(

    $('.form_date').datetimepicker({
        language:  'zh-CN',
        weekStart: 1,
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0
    }),
    $('.form_time').datetimepicker({
        language:  'zh-CN',
        weekStart: 1,
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 1,
        minView: 0,
        maxView: 1,
        forceParse: 0
    }),

    $("#add").click(function () {
        var workingInfo = addSingleDayTime();
        if (!workingInfo.workingDate && !workingInfo.weekday
            && !workingInfo.startTime && !workingInfo.endTime
            && workingInfo.workingTime !== NaN) {
            return;
        }
        var tr = "<tr>";
        if (workingInfo.errFlag) {
            tr = "<tr class='danger'>"
        }
        $("#workingTimeTable tbody").append(tr + "<td><input type='checkbox'/></td><td>" + workingInfo.workingDate + "</td>" +
            "<td>" + workingInfo.weekday + "</td><td>" + workingInfo.startTime + "</td><td>"
            + workingInfo.endTime + "</td><td class='workingTime'>" + workingInfo.workingTime + "<td></td></tr>")
    }),

    $("#calcAllTime").click(function () {
        calcAllWorkingTime();
    })
);

function calcAllWorkingTime() {
    var allTime = 0.0;
    $("#workingTimeTable .workingTime").each(function () {
        console.log($(this).text());
        allTime += parseFloat($(this).text());
    });
    console.log(allTime);
}

function addSingleDayTime() {
    var weekDays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    var workingDate = $("#workingDate").val();
    var startTime = $("#startTime").val();
    var endTime = $("#endTime").val();
    console.log(workingDate + ", startTime : " + startTime + " ; " + "endTime : " + endTime);
    var weekday = new Date(workingDate).getDay();
    var workingTime = calcWorkingHour(workingDate, startTime, endTime);
    return {
        "workingDate" : workingDate,
        "startTime" : startTime,
        "endTime": endTime,
        "weekday": weekDays[weekday],
        "workingTime": workingTime.time,
        "errFlag": workingTime.flag
    };
}

function calcWorkingHour(workingDate, startTime, endTime) {
    workingDate = workingDate.replace(/\-/g, "/");
    var moringStartTime = new Date(workingDate + " 09:01:00");
    var middleStartTime = new Date(workingDate + " 12:30:00");
    var middleEndTime = new Date(workingDate + " 14:00:00");
    var noonStartTime = new Date(workingDate + " 17:30:00");
    var noonEndTime = new Date(workingDate + " 18:00:00");
    startTime = new Date(workingDate + " " + startTime);
    endTime = new Date(workingDate + " " + endTime);
    var amTime = middleStartTime.getTime() - startTime.getTime();
    var pmTime;
    if (endTime.getTime() >= noonStartTime.getTime() && endTime.getTime() <= noonEndTime.getTime()) {
        pmTime = noonStartTime.getTime() - middleEndTime.getTime();
    } else if (endTime.getTime() >= noonEndTime.getTime() || endTime.getTime() < noonStartTime.getTime()) {
        pmTime = noonStartTime.getTime() - middleEndTime.getTime();
        pmTime += endTime.getTime() - noonEndTime.getTime();
    }
    var errFlag = false;
    if (startTime.getTime() >= moringStartTime.getTime() || endTime.getTime() < noonStartTime.getTime()) {
        errFlag = true;
    }
    return {
        time: calcHourMinSec(amTime + pmTime),
        flag: errFlag
    }
}

function calcHourMinSec(times) {
    //计算相差小时数
    var leave1=times%(24*3600*1000);    //计算天数后剩余的毫秒数
    var hours=Math.floor(leave1/(3600*1000));
    //计算相差分钟数
    var leave2=leave1%(3600*1000) ;       //计算小时数后剩余的毫秒数
    var minutes=Math.floor(leave2/(60*1000));
    console.log("hours: " + hours + ", minutes: " + minutes);
    return parseFloat(hours) + parseFloat((minutes/60).toFixed(2));
}