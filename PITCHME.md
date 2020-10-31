AWS CDKでLINE BotのDevOpsをやってみる

+++

### 自己紹介

* 名前
  * 松永勇太
* 出身
  * 滋賀県
* 居住
  * 埼玉県
* 職業
  * エンジニア
* I'm not LINE API Expert
  
+++

### Topics

1. メインワードについて
  * DevOps
  * AWS CDK
2. AWS CDKを使うメリット
3. LINE BotのDevOpsを考えてみる
  * 開発と運用それぞれの環境をわける
  * デプロイの管理
  * パッケージの更新
4. デモンストレーション
5. まとめ

+++

### はじめに

このセッションでお話することは、*LINE BotのDevOps的なものを考えてみた*の単なる一例です。開発方法（特にDevOps）に正解はないと思いますので、開発ツールの参考程度で聞いていただけると幸いです。

---

メインワードについて

+++

### DevOps

*Development（開発）*と*Operation（運用）*の混成語。

開発チームと運用チームが協力してより質の高いプロダクト・サービスを提供する取り組みを示す概念みたいなもの。DevOpsは色んな文脈で用いられますが、このセッションでは*開発と運用の両立の方法*に視点を置きます。

+++

### AWS CDK

AWS Cloud Development Kit(AWS CDK)は、使い慣れたプログラミング言語を使用してクラウドアプリケーションリソースを定義するためのオープンソースのソフトウェア開発フレームワークです([公式サイトより](https://aws.amazon.com/jp/cdk/))。

Cloud Formationの機能を使って、AWSのクラウド構成を簡単にデプロイ・削除することができる。

---

### AWS CDKを使うメリット

AWS CDKを使うメリットについて説明するために、*プロビジョニング*(クラウドの環境構築)の管理ついて深堀りしてみる。以降の内容は[この記事から引用](https://qiita.com/ufoo68/items/d06756b6e7bb97359074)します。

+++

### プロビジョニングを管理したい理由

クラウドを構築する手っ取り早い方法は[マネジメントコンソール](https://aws.amazon.com/jp/console/)を使ってGUIをポチポチ触りながら構築していく方法である。しかしこの方法でクラウドを構築してしまうと同じ構成をコピーしたいとき、構築手順や設定値を管理したい時にものすごく面倒なことになる。


+++

### テンプレートファイルでの管理

[CloudFormation](https://aws.amazon.com/jp/cloudformation/)を用いてテンプレートファイルでクラウドの構成を管理する方法がある。構成ファイルは`json`や`yaml`の形式で書くことができる。

```json
"myDynamoDBTable" : {
      "Type" : "AWS::DynamoDB::Table",
      "Properties" : {
        "AttributeDefinitions": [ { 
          "AttributeName" : {"Ref" : "HashKeyElementName"},
          "AttributeType" : {"Ref" : "HashKeyElementType"}
        } ],
        "KeySchema": [
          { "AttributeName": {"Ref" : "HashKeyElementName"}, "KeyType": "HASH" }
        ],
        "ProvisionedThroughput" : {
          "ReadCapacityUnits" : {"Ref" : "ReadCapacityUnits"},
          "WriteCapacityUnits" : {"Ref" : "WriteCapacityUnits"}
        }                
     }
}
```

+++

### CloudFormationのここがつらい

- テンプレートファイルの記法を一々ドキュメントで確認しにいく必要がある
- 構文エラーチェックがやりにくい
- 共通化したいところは自分でスクリプトを書くことになる


+++

### AWS CDKでの構成管理

*AWS CDK*ではいくつかのプログラミング言語で構成を記述することができる。以下は*TypeScript*で`lambda`+`API Gateway`+`DynamoDB`の環境を記述した例

```typescript
import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as apigateway from '@aws-cdk/aws-apigateway'
import * as dynamodb from '@aws-cdk/aws-dynamodb'

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const table = new dynamodb.Table(this, 'Table', {
      partitionKey: { name: 'key', type: dynamodb.AttributeType.STRING }
    })

    const handler = new lambda.Function(this, 'Handler', {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.asset('lambda'),
      handler: 'index.handler',
      environment: {
        TABLE_NAME: table.tableName
      }
    })

    table.grantReadWriteData(handler)

    new apigawteway.LambdaRestApi(this, 'Endpoint', {
      handler
    })

  }
}
```

+++

### AWS CDKのいいところ

- エディタの補完を使うと公式ドキュメントを確認する手間が省ける
- 型を使って構文のエラーチェックができる
- ライブラリ（もしくはnpmパッケージ作成）で共通化ができる

+++

次からのDEMOにてAWS CDKを使ったLINE Bot開発の例をお見せします。

---