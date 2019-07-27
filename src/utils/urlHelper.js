export class UrlHelper {

    static addQueryParam(url,name,value){


        Log.
        if(url.indexOf('?') <0 ){
            url+= '?';
        }

        if(!url.endsWith('?')){
            url+='&';
        }

        url += encodeURIComponent(name);
        url += "=";
        url += encodeURIComponent(value);

        return url;
    }

    static parseUrlFragment(value, delimiter = "#"){
        if (typeof value !== 'string'){
            value = location.href;
        }

        let lastIndexOfDelimiter = value.indexOf(delimiter);

        if(lastIndexOfDelimiter >=0){
            value = value.substr(lastIndexOfDelimiter + 1);
        }
        if (delimiter === "?") {
            // if we're doing query, then strip off hash fragment before we parse
            lastIndexOfDelimiter = value.indexOf('#');
            if (lastIndexOfDelimiter >= 0) {
                value = value.substr(0, lastIndexOfDelimiter);
            }
        }

        let  params = {},
            regex = /([^&=]+)=([^&]*)/g;
        let m = {};

        let counter = 0;

        while((m = regex.exec(value))!== null) {

            params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
            if (counter++ > 50) {
                Log.error("UrlUtility.parseUrlFragment: response exceeded expected number of parameters", value);
                return {
                    error: "Response exceeded expected number of parameters"
                };
            }
        }   

        return params;
    }
}