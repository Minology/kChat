class CaseConvertorUtil {
    static instance = null;

    static getInstance() {
        if (!CaseConvertorUtil.instance) {
            CaseConvertorUtil.instance = new CaseConvertorUtil();
        }
        return CaseConvertorUtil.instance;
    }

    camelCase(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
            { 
                return index == 0 ? word.toLowerCase() : word.toUpperCase(); 
            }).replace(/\s+/g, ''); 
    }

    dash_case(str) {
        return str.trim().split(/(?=[A-Z])/).join('-').toLowerCase();
    }

}

const CaseConvertor = CaseConvertorUtil.getInstance();

export default CaseConvertor;