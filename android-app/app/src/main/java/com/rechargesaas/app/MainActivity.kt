package com.rechargesaas.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.rechargesaas.app.ui.screens.*
import com.rechargesaas.app.ui.theme.BackgroundDark
import com.rechargesaas.app.ui.theme.RechargeSaaSTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            RechargeSaaSTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = BackgroundDark
                ) {
                    val navController = rememberNavController()
                    var userRoleState by remember { mutableStateOf("RETAILER") }
                    var authTokenState by remember { mutableStateOf<String?>(null) }

                    NavHost(
                        navController = navController,
                        startDestination = "login"
                    ) {
                        composable("login") {
                            LoginScreen(
                                onLoginSuccess = { token, role ->
                                    authTokenState = token
                                    userRoleState = role
                                    navController.navigate("dashboard") {
                                        popUpTo("login") { inclusive = true }
                                    }
                                }
                            )
                        }

                        composable("dashboard") {
                            DashboardScreen(
                                userRole = userRoleState,
                                onNavigateToRecharge = {
                                    navController.navigate("recharge")
                                },
                                onNavigateToWallet = {
                                    navController.navigate("wallet")
                                },
                                onLogout = {
                                    authTokenState = null
                                    navController.navigate("login") {
                                        popUpTo("dashboard") { inclusive = true }
                                    }
                                }
                            )
                        }

                        composable("recharge") {
                            RechargeScreen(
                                onNavigateBack = {
                                    navController.popBackStack()
                                },
                                onExecuteSuccess = { amount, operator, number ->
                                    // Navigate back after updating ledger state
                                    navController.popBackStack()
                                }
                            )
                        }

                        composable("wallet") {
                            WalletScreen(
                                onNavigateBack = {
                                    navController.popBackStack()
                                },
                                onTransferSuccess = { recipient, amount ->
                                    navController.popBackStack()
                                }
                            )
                        }
                    }
                }
            }
        }
    }
}
