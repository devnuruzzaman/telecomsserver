package com.rechargesaas.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Fingerprint
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rechargesaas.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LoginScreen(
    onLoginSuccess: (token: String, role: String) -> Unit
) {
    var phone by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var mfaCode by remember { mutableStateOf("") }
    var selectedRole by remember { mutableStateOf("RETAILER") }
    var passwordVisible by remember { mutableStateOf(false) }
    var mfaRequired by remember { mutableStateOf(false) }
    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var isBiometricVerifying by remember { mutableStateOf(false) }

    val roles = listOf("RETAILER", "DEALER", "DISTRIBUTOR")

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(24.dp))
                .background(SurfaceDark)
                .border(1.dp, CardBorderDark, RoundedCornerShape(24.dp))
                .padding(28.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Header
            Text(
                text = "RECHARGESAAS",
                fontSize = 22.sp,
                fontWeight = FontWeight.Bold,
                color = PrimaryDark,
                fontFamily = FontFamily.SansSerif,
                modifier = Modifier.padding(bottom = 4.dp)
            )
            
            Text(
                text = "Merchant Portal Login",
                fontSize = 14.sp,
                color = TextSecondaryDark,
                modifier = Modifier.padding(bottom = 28.dp)
            )

            if (errorMessage != null) {
                Text(
                    text = errorMessage!!,
                    color = AccentRose,
                    fontSize = 12.sp,
                    modifier = Modifier.padding(bottom = 16.dp)
                )
            }

            if (!mfaRequired) {
                // Phone Input
                OutlinedTextField(
                    value = phone,
                    onValueChange = { phone = it },
                    label = { Text("Phone Number", color = TextSecondaryDark) },
                    leadingIcon = { Icon(Icons.Default.Phone, contentDescription = "Phone", tint = PrimaryDark) },
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = PrimaryDark,
                        unfocusedBorderColor = CardBorderDark,
                        focusedTextColor = TextPrimaryDark,
                        unfocusedTextColor = TextPrimaryDark
                    ),
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone)
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Password Input
                OutlinedTextField(
                    value = password,
                    onValueChange = { password = it },
                    label = { Text("Password", color = TextSecondaryDark) },
                    leadingIcon = { Icon(Icons.Default.Lock, contentDescription = "Password", tint = PrimaryDark) },
                    trailingIcon = {
                        val image = if (passwordVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff
                        IconButton(onClick = { passwordVisible = !passwordVisible }) {
                            Icon(image, contentDescription = "Toggle password visibility", tint = TextSecondaryDark)
                        }
                    },
                    visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = PrimaryDark,
                        unfocusedBorderColor = CardBorderDark,
                        focusedTextColor = TextPrimaryDark,
                        unfocusedTextColor = TextPrimaryDark
                    ),
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                )

                Spacer(modifier = Modifier.height(20.dp))

                // Role Selector Tab Row
                Text(
                    text = "SELECT PORTAL ROLE",
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextSecondaryDark,
                    modifier = Modifier
                        .align(Alignment.Start)
                        .padding(bottom = 8.dp)
                )

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(10.dp))
                        .background(BackgroundDark)
                        .padding(4.dp),
                    horizontalArrangement = Arrangement.SpaceEvenly
                ) {
                    roles.forEach { role ->
                        val isSelected = selectedRole == role
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(8.dp))
                                .background(if (isSelected) PrimaryDark else BackgroundDark)
                                .clickable { selectedRole = role }
                                .padding(vertical = 8.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = role,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = if (isSelected) TextPrimaryDark else TextSecondaryDark
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(28.dp))

                // Action Button
                Button(
                    onClick = {
                        if (phone.isBlank() || password.isBlank()) {
                            errorMessage = "Credentials cannot be blank"
                        } else {
                            isLoading = true
                            errorMessage = null
                            // Simulate 2FA Requirement or Successful Direct Login
                            if (phone == "01711223344" || phone == "1711223344") {
                                mfaRequired = true
                                isLoading = false
                            } else {
                                // Direct success bypass
                                onLoginSuccess("mock-jwt-token-abcdef", selectedRole)
                            }
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryDark),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    if (isLoading) {
                        CircularProgressIndicator(color = TextPrimaryDark, modifier = Modifier.size(24.dp))
                    } else {
                        Text("AUTHENTICATE GATEWAY", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Biometric Fingerprint Button
                OutlinedButton(
                    onClick = { isBiometricVerifying = true },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp)
                        .border(1.dp, CardBorderDark, RoundedCornerShape(12.dp)),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = PrimaryDark),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Fingerprint,
                        contentDescription = "Biometric Login",
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("BIOMETRIC FINGERPRINT", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                }

                if (isBiometricVerifying) {
                    AlertDialog(
                        onDismissRequest = { isBiometricVerifying = false },
                        confirmButton = {
                            TextButton(onClick = { isBiometricVerifying = false }) {
                                Text("Cancel", color = AccentRose)
                            }
                        },
                        title = { Text("Biometric Authentication", color = TextPrimaryDark, fontSize = 16.sp, fontWeight = FontWeight.Bold) },
                        text = {
                            Column(
                                horizontalAlignment = Alignment.CenterHorizontally,
                                modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Fingerprint,
                                    contentDescription = "Fingerprint Sensor",
                                    tint = PrimaryDark,
                                    modifier = Modifier.size(64.dp)
                                )
                                Spacer(modifier = Modifier.height(12.dp))
                                Text("Touch the fingerprint sensor to log in securely", color = TextSecondaryDark, fontSize = 12.sp)
                            }
                        },
                        containerColor = SurfaceDark
                    )

                    // Simulate biometric scan completion
                    LaunchedEffect(Unit) {
                        kotlinx.coroutines.delay(1800)
                        isBiometricVerifying = false
                        onLoginSuccess("biometric-simulated-token-998877", selectedRole)
                    }
                }
            } else {
                // 2FA Verification Form
                Text(
                    text = "Secure Two-Factor Authentication",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimaryDark,
                    modifier = Modifier.padding(bottom = 8.dp)
                )
                Text(
                    text = "A temporal code has been sent to +880 $phone. Enter the 6-digit credential code.",
                    fontSize = 11.sp,
                    color = TextSecondaryDark,
                    modifier = Modifier.padding(bottom = 20.dp)
                )

                OutlinedTextField(
                    value = mfaCode,
                    onValueChange = { if (it.length <= 6) mfaCode = it },
                    label = { Text("6-Digit Passcode", color = TextSecondaryDark) },
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = SecondaryDark,
                        unfocusedBorderColor = CardBorderDark,
                        focusedTextColor = TextPrimaryDark,
                        unfocusedTextColor = TextPrimaryDark
                    ),
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
                )

                Spacer(modifier = Modifier.height(24.dp))

                Button(
                    onClick = {
                        if (mfaCode.length == 6) {
                            onLoginSuccess("mfa-resolved-token-990142", selectedRole)
                        } else {
                            errorMessage = "Passcode must be exactly 6 digits"
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = SecondaryDark),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("VERIFY & ACCESS", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = BackgroundDark)
                }
            }
        }
    }
}
