package com.rechargesaas.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Smartphone
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rechargesaas.app.ui.theme.*

data class OperatorInfo(val id: String, val name: String, val prefixes: List<String>, val themeColor: androidx.compose.ui.graphics.Color)
data class CellularPackage(val id: String, val name: String, val type: String, val price: Double)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RechargeScreen(
    onNavigateBack: () -> Unit,
    onExecuteSuccess: (amount: Double, operator: String, number: String) -> Unit
) {
    var phoneNumber by remember { mutableStateOf("") }
    var inputAmount by remember { mutableStateOf("") }
    var selectedPackage by remember { mutableStateOf<CellularPackage?>(null) }
    var detectedOperator by remember { mutableStateOf<OperatorInfo?>(null) }
    var showSuccessDialog by remember { mutableStateOf(false) }
    var isExecuting by remember { mutableStateOf(false) }

    val operators = listOf(
        OperatorInfo("op-1", "Grameenphone", listOf("017", "013"), PrimaryDark),
        OperatorInfo("op-2", "Robi Axiata", listOf("018"), AccentEmerald),
        OperatorInfo("op-3", "Banglalink", listOf("019", "014"), SecondaryDark),
        OperatorInfo("op-4", "Teletalk", listOf("015"), AccentRose)
    )

    val packages = listOf(
        CellularPackage("pkg-1", "Unlimited Internet Max (30 Days)", "DATA", 499.00),
        CellularPackage("pkg-2", "Weekly Voice Bundle 500 Mins", "VOICE", 189.00),
        CellularPackage("pkg-3", "Social Pack 15GB + 200 SMS", "COMBO", 250.00),
        CellularPackage("pkg-4", "Double-Data Blitz Weekend Booster", "DATA", 99.00)
    )

    // Prefix auto-detect effect as operator phone number is updated
    LaunchedEffect(phoneNumber) {
        val cleanNumber = phoneNumber.replace(" ", "").replace("-", "")
        if (cleanNumber.length >= 3) {
            val prefix = cleanNumber.take(3)
            detectedOperator = operators.find { op -> op.prefixes.contains(prefix) }
        } else {
            detectedOperator = null
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Disperse Instant Recharge", fontSize = 16.sp, fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = TextPrimaryDark)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = BackgroundDark)
            )
        },
        containerColor = BackgroundDark
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp)
        ) {
            Column(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Input phone card
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(16.dp))
                        .background(SurfaceDark)
                        .border(1.dp, CardBorderDark, RoundedCornerShape(16.dp))
                        .padding(18.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text("RECIPIENT PARAMETERS", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = TextSecondaryDark, fontFamily = FontFamily.Monospace)

                    OutlinedTextField(
                        value = phoneNumber,
                        onValueChange = { phoneNumber = it },
                        label = { Text("Mobile Number (e.g. 017xxxxxxxx)", color = TextSecondaryDark) },
                        leadingIcon = { Icon(Icons.Default.Smartphone, contentDescription = "Phone", tint = PrimaryDark) },
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

                    // Prefix auto-detect alert badge
                    detectedOperator?.let { op ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(8.dp))
                                .background(op.themeColor.copy(alpha = 0.1f))
                                .border(1.dp, op.themeColor.copy(alpha = 0.3f), RoundedCornerShape(8.dp))
                                .padding(10.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(8.dp)
                                    .clip(RoundedCornerShape(4.dp))
                                    .background(op.themeColor)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "Auto-Routing Handshake: ${op.name}",
                                color = TextPrimaryDark,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }
                }

                // Balance / Packages List
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f)
                        .clip(RoundedCornerShape(16.dp))
                        .background(SurfaceDark)
                        .border(1.dp, CardBorderDark, RoundedCornerShape(16.dp))
                        .padding(18.dp)
                ) {
                    Text("SELECT COMBO VALUE-PACKS", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = TextSecondaryDark, fontFamily = FontFamily.Monospace, modifier = Modifier.padding(bottom = 12.dp))

                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        packages.forEach { pkg ->
                            val isSelected = selectedPackage?.id == pkg.id
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(if (isSelected) PrimaryDark.copy(alpha = 0.15f) else BackgroundDark)
                                    .border(1.dp, if (isSelected) PrimaryDark else CardBorderDark, RoundedCornerShape(12.dp))
                                    .clickable {
                                        selectedPackage = pkg
                                        inputAmount = pkg.price.toString()
                                    }
                                    .padding(12.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(pkg.name, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = TextPrimaryDark)
                                    Text("Category: ${pkg.type}", fontSize = 9.sp, color = TextSecondaryDark, fontFamily = FontFamily.Monospace)
                                }
                                Text("$${pkg.price}", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = SecondaryDark, fontFamily = FontFamily.Monospace)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Or Custom Amount Input
                    OutlinedTextField(
                        value = inputAmount,
                        onValueChange = {
                            inputAmount = it
                            // Clear selected bundle if user changes the exact price
                            if (selectedPackage?.price.toString() != it) {
                                selectedPackage = null
                            }
                        },
                        label = { Text("Or Enter Custom Amount ($)", color = TextSecondaryDark) },
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
                }

                // Execute Button
                Button(
                    onClick = {
                        val amt = inputAmount.toDoubleOrNull()
                        if (phoneNumber.length >= 10 && amt != null && amt > 0) {
                            isExecuting = true
                            // Simulate high-speed network callback delays
                            isExecuting = false
                            showSuccessDialog = true
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = SecondaryDark),
                    shape = RoundedCornerShape(12.dp),
                    enabled = phoneNumber.isNotBlank() && inputAmount.isNotBlank()
                ) {
                    Text("EXECUTE DOUBLE-ENTRY DEBIT", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = BackgroundDark)
                }
            }

            // Success dialog callback
            if (showSuccessDialog) {
                AlertDialog(
                    onDismissRequest = { showSuccessDialog = false },
                    icon = { Icon(Icons.Default.CheckCircle, contentDescription = "Success", tint = AccentEmerald, modifier = Modifier.size(48.dp)) },
                    title = { Text("Recharge Initiated Successfully", color = TextPrimaryDark) },
                    text = {
                        Text(
                            text = "A recharge of $${inputAmount} has been scheduled for ${phoneNumber} via ${detectedOperator?.name ?: "Universal Gateway"}. Balance deducted from ledger.",
                            color = TextSecondaryDark,
                            fontSize = 12.sp
                        )
                    },
                    confirmButton = {
                        TextButton(
                            onClick = {
                                showSuccessDialog = false
                                onExecuteSuccess(
                                    inputAmount.toDoubleOrNull() ?: 10.0,
                                    detectedOperator?.name ?: "Universal",
                                    phoneNumber
                                )
                            }
                        ) {
                            Text("OK", color = SecondaryDark)
                        }
                    },
                    containerColor = SurfaceDark
                )
            }
        }
    }
}
