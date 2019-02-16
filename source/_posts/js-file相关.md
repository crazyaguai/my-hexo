---
title: js-file相关
date: 2019-01-31 20:00:49
tags: [js,文件,file]
categories: file
---

### Blob对象

- Blob对象表示一个不可变、原始数据的类文件对象。

#### 属性：

- Blob.size
- Blob.type

#### 方法：

- Blob.slice([start,[ end ,[contentType]]])，返回一个新的 Blob对象，包含指定范围数据。

### Blob()构造函数

- 返回一个新的 Blob 对象。
- var aBlob = new Blob( array, options );

#### 参数：

- array 是一个由ArrayBuffer, ArrayBufferView, Blob, DOMString 等对象构成的 Array ，或者其他类似对象的混合体，它将会被放进 Blob。DOMStrings会被编码为UTF-8。
- options：type，默认值为 ""，它代表了将会被放入到blob中的数组内容的MIME类型。endings，默认值为"transparent"，用于指定包含行结束符\n的字符串如何被写入。

#### js创建并下载excel

- 步骤

1. 创建Blob对象
2. 转换为dataURL或者ObjectURL
3. 使用a标签download下载

- 示例代码

```
<div id="myTable">
    <style media="screen">
        table {
            border-collapse: collapse;
        }
        table th{
            height: 50px;
            font-size: 24px;
            font-family: '微软雅黑';
            font-weight: 700;
        }
        table th {
            border: 1px #000 solid;
            height: 40px;
            background: #efefef;
        }
        table td {
            padding: 0 40px;
            border: 1px #000 solid;
            height: 40px;
            text-align: center;
        }
        table td {
            font-size: 20px;
            font-weight: 700;
        }
    </style>
    <table>
        <tr>
            <th colspan="2">主要信息</th>
            <th colspan="2">其它信息</th>
        </tr>
        <tr>
            <th>姓名</th>
            <th>性别</th>
            <th>年龄</th>
            <th>注册时间</th>
        </tr>
        <tr>
            <td>张三</td>
            <td>男</td>
            <td>18</td>
            <td>123</td>
        </tr>
        <tr>
            <td>张三</td>
            <td>男</td>
            <td>18</td>
            <td>123</td>
        </tr>
    </table>
</div>
<script>
    let table = document.getElementById('myTable').outerHTML
    var oMyBlob = new Blob([table], {type : 'application/vnd.ms-excel'});

    //方法1：使用FileReader dataURL
    let reader = new FileReader()
    reader.onload = function () {
        let a = document.createElement('a')
        a.href = reader.result
        a.download = 'a.xls'
        a.click()
    }
    reader.readAsDataURL(oMyBlob)

    //方法2：使用window.URL.createObjectURL
    let objURL = window.URL.createObjectURL(oMyBlob)
    let a = document.createElement('a')
    a.href = objURL
    a.download = 'a.xls'
    a.click()

</script>
```

### File对象

- File 对象是特殊类型的 Blob。

#### 获取方式

- <input> 元素上选择文件后返回的 FileList 对象

```
let fileInput = document.getElementById('myFile')
fileInput.addEventListener('change',()=>{
    console.log(fileInput.files)
})
```

- 由拖放操作生成的 DataTransfer 对象

```
//可以是个div
var dropbox;
dropbox = document.getElementById("dropbox");
dropbox.addEventListener("dragenter", (e)=>{
    e.stopPropagation();
    e.preventDefault();
});
dropbox.addEventListener("dragover", (e)=>{
    e.stopPropagation();
    e.preventDefault();
});
dropbox.addEventListener("drop", (e)=>{
    e.stopPropagation();
    e.preventDefault();

    var dt = e.dataTransfer;
    var files = dt.files;
    console.log(files)
    console.log(files)
});
```

- 来自 HTMLCanvasElement 上的 mozGetAsFile() API

#### 属性

- File.lastModified：文件最后修改时间
- File.lastModifiedDate：文件最后修改时间的 Date 对象
- File.name：名称
- File.size：大小
- File.type：类型
- File.webkitRelativePath：路径（非标准的）

```
//input需要设置 webkitdirectory 属性（只允许选择文件夹）
<input id="myFile" webkitdirectory type="file">
```

### File()构造器

#### 语法

- var myFile = new File(bits, name[, options]);

#### 参数

- bits：ArrayBuffer，ArrayBufferView，Blob，或者 DOMString 对象的 Array — 或者任何这些对象的组合。这是 UTF-8 编码的文件内容。
- name：USVString，表示文件名称，或者文件路径。
- options：type: DOMString，表示将要放到文件中的内容的 MIME 类型。默认值为 "" 。lastModified: 数值，表示文件最后修改时间的 Unix 时间戳（毫秒）。默认值为 Date.now()。
- https://developer.mozilla.org/zh-CN/docs/Web/API/File/File

```
var file = new File(["foo"], "foo.txt", {
  type: "text/plain",
});

```

### FileReader对象

- https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader
- 允许Web应用程序异步读取存储在用户计算机上的文件
- FileReader()返回一个新构造的FileReader
#### 属性：
- FileReader.error：读取文件发生错误
- FileReader.readyState：状态数字 EMPTY（0）、LOADING（1）、DONE（2）
- FileReader.result：文件的内容。该属性仅在读取操作完成后才有效。

#### 事件：

- 继承自EventTarget，所以所有这些事件也可以通过addEventListener方法使用。
- FileReader.onabort：中断时触发
- FileReader.onerror：错误时触发
- FileReader.onload：读取操作完成时触发
- FileReader.onloadstart：
- FileReader.onloadend：
- FileReader.onprogress：处理progress事件。该事件在读取Blob时触发。

#### 方法：

- FileReader.abort()：终止操作
- FileReader.readAsArrayBuffer()
- FileReader.readAsBinaryString()非标准的
- FileReader.readAsDataURL()
- FileReader.readAsText()

#### 例子

- input图片展示

```
<input type="file" id="inputFile">
<script>
    let inputFile = document.getElementById('inputFile')
    inputFile.addEventListener('change', () => {
        let file = inputFile.files[0]
        let reader = new FileReader()
        reader.onload = function () {
            let img = document.createElement('img')
            img.src = reader.result
            document.documentElement.appendChild(img)
        }
        reader.readAsDataURL(file)
    })
</script>
```

### ObjectURL

- https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
- https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
- objectURL = URL.createObjectURL(object);表示指定的File对象或Blob对象的url
- window.URL.revokeObjectURL(objectURL);释放一个现有的对象URL

```
//选择图片并转换为对象URL显示
<input type="file" id="file1">
<script>
    let inputFile = document.getElementById('file1')
    inputFile.addEventListener('change',()=>{
        let file = inputFile.files[0]
        let url = window.URL.createObjectURL(file)

        let img = document.createElement('img')
        img.src = url
        document.documentElement.appendChild(img)

        img.onload = function() {
            window.URL.revokeObjectURL(url)
        }
    })
</script>
```
```
//展示pdf
<input type="file" id="file2">
<iframe src="" frameborder="0" id="view"></iframe>
<script>
    let pdfInput = document.getElementById('file2')
    pdfInput.addEventListener('change',()=>{
        let file = pdfInput.files[0]
        let url = window.URL.createObjectURL(file)
        var iframe = document.getElementById('view');
        iframe.setAttribute('src', url);
    })
</script>
```
