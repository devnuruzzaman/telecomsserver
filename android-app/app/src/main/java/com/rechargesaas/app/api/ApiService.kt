package com.rechargesaas.app.api

import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.Path

// API Models representing the corporate backend contract
data class RegisterRequest(
    val email: String,
    val phone: String,
    val passwordHash: String,
    val role: String,
    val docType: String,
    val docRef: String
)

data class RegisterResponse(
    val success: Boolean,
    val message: String,
    val userId: String
)

data class LoginRequest(
    val phone: String,
    val passwordHash: String
)

data class LoginResponse(
    val accessToken: String,
    val refreshToken: String,
    val expiresIn: Long,
    val mfaRequired: Boolean
)

data class RechargeRequest(
    val recipientNumber: String,
    val operatorId: String,
    val packageId: String,
    val amount: Double,
    val clientReference: String
)

data class RechargeResponse(
    val rechargeId: String,
    val status: String,
    val recipient: String,
    val deductedBalance: Double,
    val commissionEarned: Double,
    val estimatedDelivery: String
)

data class RechargeStatusResponse(
    val rechargeId: String,
    val recipient: String,
    val amount: Double,
    val status: String,
    val operatorRef: String?,
    val completedAt: String?
)

interface ApiService {
    @POST("api/v1/auth/register")
    suspend fun register(
        @Body request: RegisterRequest
    ): RegisterResponse

    @POST("api/v1/auth/login")
    suspend fun login(
        @Body request: LoginRequest
    ): LoginResponse

    @POST("api/v1/recharges/execute")
    suspend fun executeRecharge(
        @Header("Authorization") token: String,
        @Body request: RechargeRequest
    ): RechargeResponse

    @GET("api/v1/recharges/status/{rechargeId}")
    suspend fun getRechargeStatus(
        @Header("Authorization") token: String,
        @Path("rechargeId") rechargeId: String
    ): RechargeStatusResponse
}
