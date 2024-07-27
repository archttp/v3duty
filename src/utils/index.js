import dayjs from 'dayjs'

// 时间格式化
export const $timeFormat = (datetime, type = 'yyyy-mm-dd') => {
    if(datetime == '0' || !datetime){
        return '-'
    }
    if (type == 'yyyy-mm-dd') {
        return dayjs(datetime).format('yyyy-mm-dd')
    } else {
        return dayjs(datetime).format(type)
    }
}

export const formatTimestamp = (timestamp) => {
    const datetime = new Date(timestamp);
    const year = datetime.getFullYear();
    const month = String(datetime.getMonth() + 1).padStart(2, '0');
    const day = String(datetime.getDate()).padStart(2, '0');
    const hours = String(datetime.getHours()).padStart(2, '0');
    const minutes = String(datetime.getMinutes()).padStart(2, '0');
    const seconds = String(datetime.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };


export const $getParkingTime = (inTime, outTime) => {
    //di作为一个变量传进来
    //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
    var dateBegin = new Date(inTime); //将-转化为/，使用new Date
    var dateEnd = new Date(outTime); //获取当前时间
    var dateDiff = dateEnd.getTime() - dateBegin.getTime(); //时间差的毫秒数
    var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
    var leave1 = dateDiff % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000)); //计算出小时数
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000)); //计算相差分钟数
    //计算相差秒数
    var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000);
    // hours += dayDiff * 24;
    var dealWith = function (nums) {
        if (nums < 10) {
            return "0" + nums;
        } else {
            return nums;
        }
    };
    // console.log([dayDiff, hours, minutes, seconds]);
    if (dayDiff.toString() == "NaN") {
        return "-";
    } else {
        return (
            dealWith(dayDiff) +
            "天" +
            dealWith(hours) +
            "时" +
            dealWith(minutes) +
            "分" +
            dealWith(seconds) +
            "秒"
        );
    }
}


export const commonFilter = (value, datas, returnKey, key) => {
    let returnVal = '无';
    datas.forEach(item => {
        if (item[key] == value) {
            returnVal = returnKey == null ? item : item[returnKey];
            return;
        }
    });
    return returnVal;
}


export const isDate = (arg) => {
    return arg.constructor.toString().indexOf("Date") > -1;
}

// 解析参数
export const handleFilterParams = (listQuery) => {
    let finallyListQuery = {};
    for (const key in listQuery) {
        if (key == "limit") {
            finallyListQuery[key] = {
                operator: "limit",
                page: listQuery[key]["page"],
                limit: listQuery[key]["limit"],
            };
        } else if (key == "group") {
            finallyListQuery[key] = {
                operator: "group",
                alias: listQuery[key]["alias"],
                field: listQuery[key]["field"],
            };
        } else if (
            listQuery[key]["operator"] == "order" &&
            listQuery[key]["value"] != null &&
            listQuery[key]["value"] !== ""
        ) {
            if (
                finallyListQuery[listQuery[key]["operator"]] == null ||
                typeof finallyListQuery[listQuery[key]["operator"]] == "undefined"
            ) {
                finallyListQuery[listQuery[key]["operator"]] = {
                    list: {},
                    operator: listQuery[key]["operator"],
                };
            }
            finallyListQuery[listQuery[key]["operator"]]["list"][
                listQuery[key]["field"]
            ] = {
                type: listQuery[key]["value"],
                alias: listQuery[key]["alias"],
            };
        } else if (
            listQuery[key]["operator"] == "like" &&
            listQuery[key]["value"] != null &&
            listQuery[key]["value"] !== ""
        ) {
            if (
                finallyListQuery[listQuery[key]["operator"]] == null ||
                typeof finallyListQuery[listQuery[key]["operator"]] == "undefined"
            ) {
                finallyListQuery[listQuery[key]["operator"]] = {
                    list: {},
                    operator: listQuery[key]["operator"],
                };
            }
            let likeCollection = finallyListQuery[listQuery[key]["operator"]];
            if (
                likeCollection["list"][listQuery[key]["field"]] == null ||
                typeof likeCollection["list"][listQuery[key]["field"]] == "undefined"
            ) {
                likeCollection["list"][listQuery[key]["field"]] = {};
            }
            let temp = likeCollection["list"][listQuery[key]["field"]];
            temp[temp.length] = {
                value: listQuery[key]["value"],
                alias: listQuery[key]["alias"],
            };
        } else if (listQuery[key]["value"] !== "") {
            if (
                listQuery[key]["dataType"] == "date" &&
                isDate(listQuery[key]["value"])
            ) {
                listQuery[key]["value"] = listQuery[key]["value"].getTime();
            }
            if (
                listQuery[key]["operator"] == ">=" ||
                listQuery[key]["operator"] == "<="
            ) {
                if ((listQuery[key]["operator"] == ">=" && listQuery[key.substring(0, key.length - 2) + 'LT']['value']) ||
                    (listQuery[key]["operator"] == "<=" && listQuery[key.substring(0, key.length - 2) + 'GT']['value'])
                ) {
                    let delimter = listQuery[key]["operator"] == ">=" ? "min" : "max";
                    if (
                        finallyListQuery[listQuery[key]["field"]] == null ||
                        typeof finallyListQuery[listQuery[key]["field"]] == "undefined"
                    ) {
                        finallyListQuery[listQuery[key]["field"]] = {
                            operator: "between",
                        };
                    }
                    finallyListQuery[listQuery[key]["field"]][delimter] =
                        listQuery[key]["value"];
                } else {
                    finallyListQuery[listQuery[key]["field"]] = {
                        operator: listQuery[key]["operator"],
                        value: listQuery[key]["value"],
                    };
                }

            } else {
                finallyListQuery[listQuery[key]["field"]] = {
                    operator: listQuery[key]["operator"],
                    value: listQuery[key]["value"],
                };
            }
        }
    }
    return finallyListQuery;
};

// 计算相差时间
export const timeFn = (inTime, outTime) => {
    if(!inTime || !outTime) return '-'
    //di作为一个变量传进来
    //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
    var dateBegin = new Date(inTime); //将-转化为/，使用new Date
    var dateEnd = new Date(outTime); //获取当前时间
    var dateDiff = dateEnd.getTime() - dateBegin.getTime(); //时间差的毫秒数
    var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
    var leave1 = dateDiff % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000)); //计算出小时数
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000)); //计算相差分钟数
    //计算相差秒数
    var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000);
    // hours += dayDiff * 24;
    var dealWith = function (nums) {
        if (nums < 10) {
            return "0" + nums;
        } else {
            return nums;
        }
    };
    // console.log([dayDiff, hours, minutes, seconds]);
    if (dayDiff.toString() == "NaN") {
        return "-";
    } else {
        console.log(hours);
        return (
            dealWith(dayDiff) +
            "天" +
            dealWith(hours) +
            "时" +
            dealWith(minutes) +
            "分" +
            dealWith(seconds) +
            "秒"
        );
    }
}

/**
 * 将给定的 URL 转换为 Base64 字符串
 * @param {string} url 要转换的 URL
 * @returns {Promise<string>} 转换后的 Base64 字符串
 */
export function urlToBase64 (url) {
    return new Promise((resolve, reject) => {
      // 创建一个 XMLHttpRequest 对象
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      // 设置响应类型为 blob，以获取图像数据
      xhr.responseType = 'blob';
   
      // 请求成功时的处理函数
      xhr.onload = () => {
        // 创建一个 FileReader 对象，用于读取 blob 数据
        const reader = new FileReader();
        // 读取完成时的处理函数
        reader.onloadend = () => {
          // 将读取到的数据（Base64 字符串）传递给 resolve 函数
          resolve(reader.result);
        };
        // 读取失败时的处理函数
        reader.onerror = reject;
        // 将 blob 数据读取为 Base64 字符串
        reader.readAsDataURL(xhr.response);
      };
   
      // 请求失败时的处理函数
      xhr.onerror = reject;
      // 发送请求
      xhr.send();
    });
  }