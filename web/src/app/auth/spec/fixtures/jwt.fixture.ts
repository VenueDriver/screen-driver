export class JwtFixture {

    /*
        Payload of the token contains the following claims:
        {
            "iss": "Online JWT Builder",
            "iat": 1483228800, // 2017-01-01T00:00:00.100Z
            "exp": 1483232400, // 2017-01-01T01:00:00.100Z
            "aud": "www.example.com",
            "sub": "userId",
            "userId": "userId",
            "email": "user@example.com",
            "custom:admin": "true",
            "token_use": "id"
        }
    */
    static getIdTokenForAdmin(): string {
        return 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0ODMyMjg4MDAsImV4cCI6MTQ4MzIzMjQwMCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoidXNlcklkIiwidXNlcklkIjoidXNlcklkIiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiY3VzdG9tOmFkbWluIjoidHJ1ZSIsInRva2VuX3VzZSI6ImlkIn0.7LtBtc5VuEOL906C499Mx-VOPxstMrTO6k_0Ewc2lnw';
    }

    /*
        Payload of the token contains the following claims:
        {
            "iss": "Online JWT Builder",
            "iat": 1483228800, // 2017-01-01T01:00:00.100Z
            "exp": 1483232400, // 2017-01-01T02:00:00.100Z
            "aud": "www.example.com",
            "sub": "userId",
            "userId": "userId",
            "email": "user@example.com",
            "custom:admin": "true",
            "token_use": "id"
        }
    */
    static getUpdatedIdTokenForAdmin(): string {
        return 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0ODMyMzI0MDAsImV4cCI6MTQ4MzIzNjAwMCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoidXNlcklkIiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiY3VzdG9tOmFkbWluIjoidHJ1ZSIsInRva2VuX3VzZSI6ImlkIiwidXNlcklkIjoidXNlcklkIn0.PqAYNFzkHLJ5pNYks01cF4cFwKiRpi1frBEp2pGw3Q8';
    }

    /*
        Payload of the token contains the following claims:
        {
            "iss": "Online JWT Builder",
            "iat": 1483228800, // 2017-01-01T00:00:00.100Z
            "exp": 1483232400, // 2017-01-01T01:00:00.100Z
            "aud": "www.example.com",
            "sub": "operatorId",
            "userId": "operatorId",
            "email": "operator@example.com",
            "custom:admin": "false",
            "token_use": "id"
        }
    */
    static getIdTokenForOperator(): string {
        return 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0ODMyMjg4MDAsImV4cCI6MTQ4MzIzMjQwMCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoib3BlcmF0b3JJZCIsImVtYWlsIjoib3BlcmF0b3JAZXhhbXBsZS5jb20iLCJjdXN0b206YWRtaW4iOiJmYWxzZSIsInRva2VuX3VzZSI6ImlkIiwidXNlcklkIjoib3BlcmF0b3JJZCJ9.2BwRTUnNhPd_o8sukrR33T6b290lSLAtCKAKsXM3hH0';
    }

    /*
        Payload of the token contains the following claims:
        {
            "iss": "Online JWT Builder",
            "iat": 1483228800, // 2017-01-01T00:00:00.100Z
            "exp": 1483232400, // 2017-01-01T01:00:00.100Z
            "aud": "",
            "sub": "userId",
            "token_use": "access"
        }
     */
    static getAccessToken(): string {
        return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0ODMyMjg4MDAsImV4cCI6MTQ4MzIzMjQwMCwiYXVkIjoiIiwic3ViIjoidXNlcklkIiwidG9rZW5fdXNlIjoiYWNjZXNzIn0.b8bixTkVCKS5Qye0atL4FDk8NdN26Sw9AEi6ylsgDls';
    }

    /*
        Payload of the token contains the following claims:
        {
            "iss": "Online JWT Builder",
            "iat": 1483228800, // 2017-01-01T01:00:00.100Z
            "exp": 1483232400, // 2017-01-01T02:00:00.100Z
            "aud": "",
            "sub": "userId",
            "token_use": "access"
        }
     */
    static getUpdateAccessToken(): string {
        return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0ODMyMzI0MDAsImV4cCI6MTQ4MzIzNjAwMCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoidXNlcklkIiwidG9rZW5fdXNlIjoiYWNjZXNzIn0.iJxZv6W6MwIDDswWm6D2GpQrysWPoSn8R1y9PjFc91g'
    }

    static getRefreshToken(): string {
        return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3sdfsdfMiOiJPbmxpbmUgSldkZXIiLCJpYXQiOjE0ODMyMjg4MDAsImV4cCI6MTQ4MzIzMjQwMCwiYXVkIjoiIiwic3ViIjoidXNlcklkIiwidG9rZW5fdXNlIjoiYWNjZXNzIn0.unwFkqOK6Cp3lStq.V_oItMGGjvA-0JBT1PzY3LpGyo6XqBd8O2ZRCYZe6399futKRbEDnrdJUfbaJEcaHvsVwT5DAM7VIfK2ye9dlWFX5CN3nzPBejN2ZXrh_mjBHeBGlaKc258Vtq6C4fVJKBOwKd_2AQqRJH5PBzbkIfg5NltxbDN_9vZDliJsXSI6AkurI21GZvZ3yqb3_CNey4GK498AYmJJecI7D1mSrRXSVH27JaNbInU-hwIgc_9s22jHmKfmeYnRre9-';
    }

}
