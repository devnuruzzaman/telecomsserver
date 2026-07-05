import React, { useState, useEffect } from 'react';
import { 
  Smartphone, ShieldCheck, Send, Layers, RefreshCw, 
  ArrowLeft, CheckCircle2, AlertTriangle, Key, ArrowUpRight, 
  LogOut, Wallet, User, Eye, EyeOff, Radio, Info, Code, Copy, Check, Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type ScreenType = 'login' | 'dashboard' | 'recharge' | 'wallet';

export default function AndroidApp() {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('login');
  
  // Simulated Phone Form States
  const [loginPhone, setLoginPhone] = useState('01711223344');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');
  const [loginRole, setLoginRole] = useState<'RETAILER' | 'DEALER' | 'DISTRIBUTOR'>('RETAILER');
  const [mfaCode, setMfaCode] = useState('');
  const [mfaRequired, setMfaRequired] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Recharge States
  const [rechargeNumber, setRechargeNumber] = useState('');
  const [detectedOperator, setDetectedOperator] = useState<string | null>(null);
  const [selectedPkgId, setSelectedPkgId] = useState('pkg-1');
  const [customAmount, setCustomAmount] = useState('499.00');
  const [isExecuting, setIsExecuting] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Wallet States
  const [walletRecipient, setWalletRecipient] = useState('');
  const [walletAmount, setWalletAmount] = useState('');
  const [walletMemo, setWalletMemo] = useState('');
  const [showTransferAlert, setShowTransferAlert] = useState(false);

  // General States
  const [isCopied, setIsCopied] = useState(false);
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);

  // Operator Detection Effect matching Kotlin code
  useEffect(() => {
    const cleanNum = rechargeNumber.replace(/\D/g, '');
    if (cleanNum.length >= 3) {
      const prefix = cleanNum.slice(0, 3);
      if (prefix === '017' || prefix === '013') {
        setDetectedOperator('Grameenphone (GP_NET)');
      } else if (prefix === '018') {
        setDetectedOperator('Robi Axiata (ROBI_NET)');
      } else if (prefix === '019' || prefix === '014') {
        setDetectedOperator('Banglalink (BL_NET)');
      } else if (prefix === '015') {
        setDetectedOperator('Teletalk (TT_NET)');
      } else {
        setDetectedOperator('Universal Web-Gateway');
      }
    } else {
      setDetectedOperator(null);
    }
  }, [rechargeNumber]);

  // Handle Login simulation
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPhone === '01711223344') {
      setMfaRequired(true);
    } else {
      setActiveScreen('dashboard');
    }
  };

  const verifyMfaSubmit = () => {
    if (mfaCode.length === 6) {
      setActiveScreen('dashboard');
      setMfaRequired(false);
      setMfaCode('');
    } else {
      alert('Simulated Code: Enter a 6-digit passcode (e.g. 123456)');
    }
  };

  // Code snippets for Right side display dynamically
  const codeSnippets: Record<ScreenType, string> = {
    login: `package com.rechargesaas.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Fingerprint
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.rechargesaas.app.ui.theme.*

@Composable
fun LoginScreen(onLoginSuccess: (token: String, role: String) -> Unit) {
    var phone by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var selectedRole by remember { mutableStateOf("RETAILER") }
    var mfaRequired by remember { mutableStateOf(false) }
    var isBiometricVerifying by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier.fillMaxSize().background(BackgroundDark).padding(24.dp),
        verticalArrangement = Arrangement.Center
    ) {
        Text("RECHARGESAAS", style = MaterialTheme.typography.headlineMedium, color = PrimaryDark)
        
        if (!mfaRequired) {
            OutlinedTextField(
                value = phone,
                onValueChange = { phone = it },
                label = { Text("Phone Number") }
            )
            // ... credentials input and role-selector implementation ...
            Button(onClick = { 
                if (phone == "01711223344") mfaRequired = true 
                else onLoginSuccess("mock-jwt-token", selectedRole)
            }) {
                Text("AUTHENTICATE GATEWAY")
            }

            Spacer(modifier = Modifier.height(12.dp))

            OutlinedButton(onClick = { isBiometricVerifying = true }) {
                Icon(Icons.Default.Fingerprint, contentDescription = "Fingerprint Login")
                Spacer(modifier = Modifier.width(8.dp))
                Text("BIOMETRIC FINGERPRINT")
            }
        }

        if (isBiometricVerifying) {
            AlertDialog(
                onDismissRequest = { isBiometricVerifying = false },
                title = { Text("Biometric Authentication") },
                text = { Text("Touch the fingerprint sensor to log in securely") }
            )
            LaunchedEffect(Unit) {
                delay(1800)
                isBiometricVerifying = false
                onLoginSuccess("biometric-simulated-token", selectedRole)
            }
        }
    }
}`,
    dashboard: `package com.rechargesaas.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import com.rechargesaas.app.ui.theme.*

@Composable
fun DashboardScreen(
    userRole: String,
    onNavigateToRecharge: () -> Unit,
    onNavigateToWallet: () -> Unit,
    onLogout: () -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(title = { Text("RechargeSaaS Mobile") }, actions = {
                IconButton(onClick = onLogout) { Icon(Icons.Default.Logout, tint = AccentRose) }
            })
        },
        containerColor = BackgroundDark
    ) { padding ->
        LazyColumn(modifier = Modifier.padding(padding).padding(16.dp)) {
            item {
                // Double-Entry Ledger Card
                Card(colors = CardDefaults.cardColors(containerColor = SurfaceDark)) {
                    Text("MAIN LEDGER BALANCE", color = TextSecondaryDark)
                    Text("$12,450.00", color = SecondaryDark)
                }
            }
            item {
                Row {
                    Button(onClick = onNavigateToRecharge) { Text("Airtime Top-Up") }
                    Button(onClick = onNavigateToWallet) { Text("Wallet Ledger") }
                }
            }
        }
    }
}`,
    recharge: `package com.rechargesaas.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.rechargesaas.app.ui.theme.*

@Composable
fun RechargeScreen(
    onNavigateBack: () -> Unit,
    onExecuteSuccess: (Double, String, String) -> Unit
) {
    var phoneNumber by remember { mutableStateOf("") }
    var detectedOperator by remember { mutableStateOf<OperatorInfo?>(null) }
    var selectedPackage by remember { mutableStateOf<CellularPackage?>(null) }

    // Dynamic Prefix detection mimicking backend gateway routes
    LaunchedEffect(phoneNumber) {
        val clean = phoneNumber.replace(" ", "")
        if (clean.length >= 3) {
            val prefix = clean.take(3)
            detectedOperator = when(prefix) {
                "017", "013" -> OperatorInfo("op-1", "Grameenphone", PrimaryDark)
                "018" -> OperatorInfo("op-2", "Robi Axiata", AccentEmerald)
                "019", "014" -> OperatorInfo("op-3", "Banglalink", SecondaryDark)
                "015" -> OperatorInfo("op-4", "Teletalk", AccentRose)
                else -> null
            }
        }
    }

    // Material Design 3 Input and submission
    Button(
        onClick = { onExecuteSuccess(packagePrice, detectedOperator!!.name, phoneNumber) },
        enabled = detectedOperator != null
    ) {
        Text("EXECUTE DOUBLE-ENTRY DEBIT")
    }
}`,
    wallet: `package com.rechargesaas.app.ui.screens

import androidx.compose.material3.*
import androidx.compose.runtime.*
import com.rechargesaas.app.ui.theme.*

@Composable
fun WalletScreen(
    onNavigateBack: () -> Unit,
    onTransferSuccess: (String, Double) -> Unit
) {
    var recipientPhone by remember { mutableStateOf("") }
    var transferAmount by remember { mutableStateOf("") }

    Column(modifier = Modifier.background(BackgroundDark).padding(16.dp)) {
        Text("PEER-TO-PEER BALANCE DISPERSAL", color = TextSecondaryDark)
        OutlinedTextField(
            value = recipientPhone,
            onValueChange = { recipientPhone = it },
            label = { Text("Recipient Agent Phone") }
        )
        OutlinedTextField(
            value = transferAmount,
            onValueChange = { transferAmount = it },
            label = { Text("Transfer Amount ($)") }
        )
        Button(onClick = { onTransferSuccess(recipientPhone, transferAmount.toDouble()) }) {
            Text("AUTHORIZE P2P TRANSFER")
        }
    }
}`
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[activeScreen]);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-8" id="android-tab-content">
      {/* Overview Card */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-indigo-400" />
          <h2 className="text-xl font-bold text-white font-display">Native Jetpack Compose Android Client</h2>
        </div>
        <p className="text-sm text-slate-400">
          The unified platform shares raw REST endpoints with a native Android retail client. Explore the responsive simulation below and inspect real production Jetpack Compose Kotlin sources dynamically mapped to each active layout state.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Phone Device Mockup Container (4 cols) */}
        <div className="xl:col-span-5 flex justify-center">
          
          {/* Simulated Phone Device Frame */}
          <div className="w-[310px] h-[640px] rounded-[42px] border-[10px] border-slate-900 bg-slate-950 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col select-none ring-4 ring-slate-800/40">
            
            {/* Top Notch Camera */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-full z-50 flex items-center justify-center gap-1.5 px-3">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500/70" />
              <div className="w-12 h-1 bg-slate-950 rounded-full" />
              <span className="h-1 w-1 rounded-full bg-slate-800" />
            </div>

            {/* Dynamic Simulated Display */}
            <div className="flex-1 overflow-hidden flex flex-col bg-slate-950 pt-8 text-white text-xs relative">
              
              {/* Active Screen Rendering Router */}
              <AnimatePresence mode="wait">
                
                {activeScreen === 'login' && (
                  <motion.div 
                    key="login"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex-1 p-5 flex flex-col justify-between"
                  >
                    <div className="space-y-6 my-auto">
                      {/* Logo and metadata */}
                      <div className="text-center space-y-1">
                        <span className="text-[9px] font-mono tracking-widest text-indigo-400 uppercase font-bold bg-indigo-950/50 px-2 py-0.5 rounded border border-indigo-900/60 inline-block">Material Design 3</span>
                        <h3 className="text-lg font-extrabold tracking-tight font-display text-white mt-2">RECHARGESAAS</h3>
                        <p className="text-[10px] text-slate-500 font-mono">Secure Node: AUTH_GATEWAY</p>
                      </div>

                      <form onSubmit={handleLoginSubmit} className="space-y-3">
                        {!mfaRequired ? (
                          <>
                            {/* Phone Input */}
                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-slate-400 block uppercase">Phone Number</label>
                              <div className="relative">
                                <span className="absolute left-3 top-2.5 text-slate-500 text-[11px] font-mono">+880</span>
                                <input 
                                  type="text" 
                                  value={loginPhone}
                                  onChange={(e) => setLoginPhone(e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-12 pr-3 text-xs text-white focus:border-indigo-500 focus:outline-none font-mono"
                                />
                              </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-slate-400 block uppercase">Password</label>
                              <div className="relative">
                                <input 
                                  type={showPassword ? "text" : "password"} 
                                  value={loginPassword}
                                  onChange={(e) => setLoginPassword(e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-3 pr-9 text-xs text-white focus:border-indigo-500 focus:outline-none font-mono"
                                />
                                <button 
                                  type="button" 
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-2.5 top-2 text-slate-500 hover:text-slate-300"
                                >
                                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              </div>
                            </div>

                            {/* Portal selector */}
                            <div className="space-y-1 pt-1">
                              <label className="text-[9px] font-mono text-slate-400 block uppercase">Tenant Role</label>
                              <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-850">
                                {['RETAILER', 'DEALER', 'DISTRIBUTOR'].map((r) => (
                                  <button
                                    key={r}
                                    type="button"
                                    onClick={() => setLoginRole(r as any)}
                                    className={`flex-1 py-1 rounded text-[8px] font-mono font-bold transition-all ${
                                      loginRole === r ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'
                                    }`}
                                  >
                                    {r.slice(0, 5)}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <button 
                              type="submit"
                              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-[10px] font-mono tracking-wider mt-2 transition-all cursor-pointer uppercase"
                            >
                              Authenticate Gateway
                            </button>

                            <button 
                              type="button"
                              onClick={() => {
                                setIsBiometricScanning(true);
                                setTimeout(() => {
                                  setIsBiometricScanning(false);
                                  setActiveScreen('dashboard');
                                }, 1800);
                              }}
                              className="w-full py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-indigo-400 hover:text-indigo-300 font-bold rounded-xl text-[10px] font-mono tracking-wider mt-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 uppercase"
                            >
                              <Fingerprint className="h-4 w-4" />
                              <span>Biometric Fingerprint</span>
                            </button>
                          </>
                        ) : (
                          <div className="space-y-4">
                            <div className="text-center space-y-1 bg-indigo-950/20 p-3 rounded-xl border border-indigo-900/30">
                              <Key className="h-5 w-5 text-indigo-400 mx-auto" />
                              <h4 className="text-[11px] font-bold text-white">2FA Token Verification</h4>
                              <p className="text-[9px] text-slate-400">Temporal code dispatched to terminal +880 {loginPhone}</p>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-slate-400 block uppercase text-center">Enter 6-Digit Code</label>
                              <input 
                                type="text" 
                                maxLength={6}
                                placeholder="123456"
                                value={mfaCode}
                                onChange={(e) => setMfaCode(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 text-center text-sm tracking-widest text-white focus:border-teal-500 focus:outline-none font-mono"
                              />
                            </div>

                            <button 
                              type="button"
                              onClick={verifyMfaSubmit}
                              className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-[10px] font-mono tracking-wider transition-all cursor-pointer uppercase"
                            >
                              Verify & Access
                            </button>

                            <button 
                              type="button"
                              onClick={() => setMfaRequired(false)}
                              className="w-full py-1 text-slate-500 hover:text-slate-300 text-[9px] font-mono tracking-wider uppercase"
                            >
                              Go Back
                            </button>
                          </div>
                        )}
                      </form>
                    </div>

                    <div className="text-center text-[8px] font-mono text-slate-600">
                      SECURE CREDENTIAL CIPHER: SHA-256
                    </div>

                    {isBiometricScanning && (
                      <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center z-50">
                        <div className="relative">
                          <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-md animate-ping" />
                          <div className="p-4 rounded-full bg-indigo-950/50 border border-indigo-500/30 text-indigo-400 relative">
                            <Fingerprint className="h-12 w-12 animate-pulse" />
                          </div>
                        </div>
                        <h4 className="text-xs font-bold text-white mt-4">Biometric Sensor Active</h4>
                        <p className="text-[9px] text-slate-400 mt-1 max-w-[200px] leading-relaxed">
                          Place your finger on the device sensor to verify identity...
                        </p>
                        <span className="text-[8px] font-mono text-slate-600 mt-6 block">SECURE HANDSHAKE SIMULATION</span>
                        <button
                          type="button"
                          onClick={() => setIsBiometricScanning(false)}
                          className="mt-6 px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[9px] font-mono text-slate-400 hover:text-white cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeScreen === 'dashboard' && (
                  <motion.div 
                    key="dashboard"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex-1 p-4 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* App Header Bar */}
                      <div className="flex justify-between items-center border-b border-slate-900 pb-2.5">
                        <div className="flex items-center gap-1.5">
                          <div className="h-6 w-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                            <User className="h-3.5 w-3.5 text-slate-400" />
                          </div>
                          <div>
                            <h4 className="text-[10px] font-bold text-slate-200">B2B Portal Node</h4>
                            <p className="text-[8px] font-mono text-teal-400">role: {loginRole}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setActiveScreen('login');
                            setMfaRequired(false);
                          }}
                          className="p-1 rounded bg-slate-900 border border-slate-850 hover:bg-slate-850 hover:text-rose-400 text-slate-500 transition-all cursor-pointer"
                        >
                          <LogOut className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Main Balance card */}
                      <div className="bg-slate-900/60 border border-slate-850 p-4 rounded-xl space-y-3 relative overflow-hidden">
                        <div className="absolute top-2 right-2 text-[8px] font-mono text-slate-600">MAIN_LEDGER</div>
                        <div className="space-y-0.5">
                          <span className="text-[8px] font-mono text-slate-500 uppercase">Current Cash Balance</span>
                          <h2 className="text-2xl font-black font-mono text-teal-400">$12,450.00</h2>
                        </div>
                        <div className="flex justify-between text-[8px] font-mono text-slate-400 pt-2 border-t border-slate-850/60">
                          <div>
                            <span className="text-slate-500 block uppercase text-[7px]">Commissions</span>
                            <span className="text-emerald-400 font-bold">$248.50</span>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-500 block uppercase text-[7px]">Dispatches (Today)</span>
                            <span className="text-white font-bold">142 Top-ups</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Dispatches Grid */}
                      <div className="space-y-1.5">
                        <span className="text-[8px] font-mono text-slate-500 block uppercase">Dispatch Desk</span>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setActiveScreen('recharge')}
                            className="bg-slate-900/30 border border-slate-850 p-3 rounded-xl hover:border-indigo-500 transition-all text-left group cursor-pointer flex flex-col justify-between h-20"
                          >
                            <div className="p-1.5 rounded-lg bg-indigo-950/50 border border-indigo-900/60 text-indigo-400 w-fit">
                              <Send className="h-3 w-3" />
                            </div>
                            <div>
                              <span className="text-[9px] font-bold block text-slate-200">Airtime Top-Up</span>
                              <span className="text-[7px] text-slate-500">Auto-detect prefix</span>
                            </div>
                          </button>

                          <button
                            onClick={() => setActiveScreen('wallet')}
                            className="bg-slate-900/30 border border-slate-850 p-3 rounded-xl hover:border-teal-500 transition-all text-left group cursor-pointer flex flex-col justify-between h-20"
                          >
                            <div className="p-1.5 rounded-lg bg-teal-950/50 border border-teal-900/60 text-teal-400 w-fit">
                              <Wallet className="h-3 w-3" />
                            </div>
                            <div>
                              <span className="text-[9px] font-bold block text-slate-200">Wallet Ledger</span>
                              <span className="text-[7px] text-slate-500">P2P Credit transfer</span>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Static recent feed */}
                      <div className="space-y-1.5">
                        <span className="text-[8px] font-mono text-slate-500 block uppercase">Ledger Streams</span>
                        <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                          
                          <div className="p-2 bg-slate-950/80 border border-slate-900 rounded-lg flex justify-between items-center text-[8px] font-mono">
                            <div className="flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                              <div>
                                <span className="text-slate-200 block font-bold">01711223344</span>
                                <span className="text-slate-500">GP_NET · 04:32 PM</span>
                              </div>
                            </div>
                            <span className="font-bold text-slate-200">-$500.00</span>
                          </div>

                          <div className="p-2 bg-slate-950/80 border border-slate-900 rounded-lg flex justify-between items-center text-[8px] font-mono">
                            <div className="flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                              <div>
                                <span className="text-slate-200 block font-bold">01855599012</span>
                                <span className="text-slate-500">ROBI_NET · 03:15 PM</span>
                              </div>
                            </div>
                            <span className="font-bold text-slate-200">-$1,000.00</span>
                          </div>

                        </div>
                      </div>

                    </div>

                    <div className="text-center text-[8px] font-mono text-slate-600 pt-2 border-t border-slate-900 flex justify-between">
                      <span>SECURE DEVICE BOUND</span>
                      <span>v1.0.0</span>
                    </div>
                  </motion.div>
                )}

                {activeScreen === 'recharge' && (
                  <motion.div 
                    key="recharge"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex-1 p-4 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Sub-page top bar */}
                      <div className="flex items-center gap-2 border-b border-slate-900 pb-2.5">
                        <button 
                          onClick={() => setActiveScreen('dashboard')}
                          className="p-1 rounded hover:bg-slate-900 transition-all cursor-pointer"
                        >
                          <ArrowLeft className="h-3 w-3 text-slate-400" />
                        </button>
                        <h4 className="text-[10px] font-bold text-white uppercase tracking-wider font-mono">Disperse Airtime</h4>
                      </div>

                      {/* Phone entry parameters */}
                      <div className="space-y-3 bg-slate-900/60 p-3 rounded-xl border border-slate-850">
                        <span className="text-[7.5px] font-mono text-slate-500 block uppercase">Terminal Parameters</span>
                        
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-400 block uppercase">Recipient Number</label>
                          <input 
                            type="text" 
                            placeholder="e.g. 01711000000"
                            value={rechargeNumber}
                            onChange={(e) => setRechargeNumber(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-850 rounded-lg py-1.5 px-2.5 text-[10px] text-white focus:border-indigo-500 focus:outline-none font-mono"
                          />
                        </div>

                        {/* Animated prefix badge indicator */}
                        <AnimatePresence>
                          {detectedOperator && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="p-1.5 rounded bg-indigo-950/40 border border-indigo-900/40 text-[8px] font-mono text-indigo-300 flex items-center gap-1.5 overflow-hidden"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                              <span>Route: <strong className="font-bold text-white">{detectedOperator}</strong></span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Combo selection */}
                      <div className="space-y-2">
                        <span className="text-[7.5px] font-mono text-slate-500 block uppercase">Combos Value-Packs</span>
                        <div className="space-y-1 max-h-[120px] overflow-y-auto pr-1">
                          
                          {[
                            { id: 'pkg-1', name: 'Unlimited Internet (30d)', price: '499.00' },
                            { id: 'pkg-2', name: 'Weekly Voice Bundle (7d)', price: '189.00' },
                            { id: 'pkg-3', name: 'Social Pack 15GB + SMS', price: '250.00' }
                          ].map((pkg) => (
                            <div
                              key={pkg.id}
                              onClick={() => {
                                setSelectedPkgId(pkg.id);
                                setCustomAmount(pkg.price);
                              }}
                              className={`p-2 rounded-lg border text-[8px] font-mono flex justify-between items-center cursor-pointer transition-all ${
                                selectedPkgId === pkg.id 
                                  ? 'bg-indigo-950/40 border-indigo-500 text-white' 
                                  : 'bg-slate-950/60 border-slate-900 text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              <span>{pkg.name}</span>
                              <span className="font-bold text-teal-400">${pkg.price}</span>
                            </div>
                          ))}

                        </div>
                      </div>

                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          if (rechargeNumber.length >= 10) {
                            setIsExecuting(true);
                            setTimeout(() => {
                              setIsExecuting(false);
                              setShowSuccessAlert(true);
                            }, 1000);
                          } else {
                            alert('Enter a valid mobile terminal number of 11 digits (e.g. 01711223344)');
                          }
                        }}
                        disabled={!rechargeNumber}
                        className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 disabled:bg-slate-900 disabled:text-slate-600 text-slate-950 font-bold rounded-xl text-[9px] font-mono tracking-wider transition-all cursor-pointer uppercase"
                      >
                        {isExecuting ? 'Invoking Worker...' : 'Execute Debit Handshake'}
                      </button>
                    </div>

                    {/* Dialog success mock inside the phone */}
                    {showSuccessAlert && (
                      <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center z-50 animate-fade-in">
                        {/* Lottie-style Checkmark Animation Container */}
                        <div id="success-indicator-container" className="relative flex flex-col items-center justify-center mb-4">
                          {/* Radial Glow */}
                          <motion.div
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: [0.6, 1.2, 1], opacity: [0, 0.4, 0.25] }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="absolute h-24 w-24 rounded-full bg-emerald-500/30 blur-xl"
                          />

                          {/* Outer Burst Circles / Rings */}
                          <motion.div
                            initial={{ scale: 0.5, opacity: 0.8 }}
                            animate={{ scale: 1.4, opacity: 0 }}
                            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                            className="absolute h-16 w-16 rounded-full border-2 border-emerald-500/40"
                          />

                          {/* Particle Sparks */}
                          {[
                            { x: -35, y: -35, delay: 0.45 },
                            { x: 35, y: -35, delay: 0.45 },
                            { x: -45, y: 0, delay: 0.5 },
                            { x: 45, y: 0, delay: 0.5 },
                            { x: -25, y: 35, delay: 0.55 },
                            { x: 25, y: 35, delay: 0.55 },
                          ].map((spark, idx) => (
                            <motion.span
                              key={idx}
                              initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                              animate={{ x: spark.x, y: spark.y, scale: [0.3, 1, 0], opacity: [1, 1, 0] }}
                              transition={{ delay: spark.delay, duration: 0.6, ease: "easeOut" }}
                              className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400"
                            />
                          ))}

                          {/* Main Circle & Checkmark SVG */}
                          <motion.div
                            initial={{ scale: 0.3, opacity: 0 }}
                            animate={{ scale: [0.3, 1.15, 1], opacity: 1 }}
                            transition={{ 
                              type: "spring", 
                              stiffness: 260, 
                              damping: 15,
                              duration: 0.6 
                            }}
                            className="relative z-10 h-16 w-16 rounded-full bg-slate-900 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                          >
                            <svg
                              className="h-9 w-9 text-emerald-400"
                              viewBox="0 0 52 52"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="4"
                            >
                              {/* Circle Draw */}
                              <motion.circle
                                cx="26"
                                cy="26"
                                r="23"
                                stroke="currentColor"
                                strokeDasharray="145"
                                initial={{ strokeDashoffset: 145 }}
                                animate={{ strokeDashoffset: 0 }}
                                transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
                              />
                              {/* Checkmark Draw */}
                              <motion.path
                                d="M14 27l8 8 16-16"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ delay: 0.45, duration: 0.35, ease: "easeInOut" }}
                              />
                            </svg>
                          </motion.div>
                        </div>

                        <h4 className="text-xs font-bold text-white">Recharge Dispatched</h4>
                        <p className="text-[9px] text-slate-400 mt-1 max-w-[200px] leading-relaxed">
                          Recharge of <strong>${customAmount}</strong> successfully routed to <strong>{rechargeNumber}</strong> via <strong>{detectedOperator?.split(' ')[0]}</strong>.
                        </p>
                        <button
                          onClick={() => {
                            setShowSuccessAlert(false);
                            setRechargeNumber('');
                            setActiveScreen('dashboard');
                          }}
                          className="mt-4 px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-[9px] font-mono text-teal-400 cursor-pointer hover:bg-slate-850 hover:text-teal-300 transition-colors"
                        >
                          OK
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeScreen === 'wallet' && (
                  <motion.div 
                    key="wallet"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex-1 p-4 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-center gap-2 border-b border-slate-900 pb-2.5">
                        <button 
                          onClick={() => setActiveScreen('dashboard')}
                          className="p-1 rounded hover:bg-slate-900 transition-all cursor-pointer"
                        >
                          <ArrowLeft className="h-3 w-3 text-slate-400" />
                        </button>
                        <h4 className="text-[10px] font-bold text-white uppercase tracking-wider font-mono">Wallet Ledger</h4>
                      </div>

                      {/* Cash banner */}
                      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-850 flex items-center gap-2">
                        <Info className="h-4 w-4 text-indigo-400" />
                        <div>
                          <span className="text-[7.5px] font-mono text-slate-500 block">Ledger Account Balance</span>
                          <span className="text-sm font-bold font-mono text-teal-400">$12,450.00</span>
                        </div>
                      </div>

                      {/* Form */}
                      <div className="space-y-3 bg-slate-900/30 p-3 rounded-xl border border-slate-850">
                        <span className="text-[7.5px] font-mono text-slate-500 block uppercase">Dispersal Parameters</span>

                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-400 block uppercase">Recipient Agent Phone</label>
                          <input 
                            type="text" 
                            placeholder="e.g. 01855599012"
                            value={walletRecipient}
                            onChange={(e) => setWalletRecipient(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-850 rounded-lg py-1.5 px-2.5 text-[10px] text-white focus:border-indigo-500 focus:outline-none font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-400 block uppercase">Transfer Amount ($)</label>
                          <input 
                            type="number" 
                            placeholder="100.00"
                            value={walletAmount}
                            onChange={(e) => setWalletAmount(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-850 rounded-lg py-1.5 px-2.5 text-[10px] text-white focus:border-indigo-500 focus:outline-none font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-400 block uppercase">Memo Reference</label>
                          <input 
                            type="text" 
                            placeholder="Weekly credit reload"
                            value={walletMemo}
                            onChange={(e) => setWalletMemo(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-850 rounded-lg py-1.5 px-2.5 text-[10px] text-white focus:border-indigo-500 focus:outline-none font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (walletRecipient && walletAmount) {
                          setShowTransferAlert(true);
                        } else {
                          alert('Please enter recipient and amount');
                        }
                      }}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-[9px] font-mono tracking-wider transition-all cursor-pointer uppercase"
                    >
                      Authorize P2P Transfer
                    </button>

                    {showTransferAlert && (
                      <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center z-50 animate-fade-in">
                        <CheckCircle2 className="h-10 w-10 text-indigo-400 mb-3" />
                        <h4 className="text-xs font-bold text-white">Transfer Authorized</h4>
                        <p className="text-[9px] text-slate-400 mt-1 max-w-[200px] leading-relaxed">
                          P2P reload of <strong>${walletAmount}</strong> sent successfully to terminal <strong>{walletRecipient}</strong>. Ledger balances updated.
                        </p>
                        <button
                          onClick={() => {
                            setShowTransferAlert(false);
                            setWalletRecipient('');
                            setWalletAmount('');
                            setWalletMemo('');
                            setActiveScreen('dashboard');
                          }}
                          className="mt-4 px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-[9px] font-mono text-teal-400 cursor-pointer"
                        >
                          OK
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Simulated Android Navigation Gestures Bar */}
            <div className="h-6 bg-slate-950 flex justify-center items-center pb-1 gap-12 text-slate-700">
              <span className="cursor-pointer hover:text-slate-400" onClick={() => { if(activeScreen !== 'login') setActiveScreen('dashboard') }}><div className="w-3.5 h-3.5 border-2 border-current rounded-sm rotate-45" /></span>
              <span className="cursor-pointer hover:text-slate-400" onClick={() => { if(activeScreen !== 'login') setActiveScreen('dashboard') }}><div className="w-3 h-3 border-2 border-current rounded-full" /></span>
              <span className="cursor-pointer hover:text-slate-400" onClick={() => { if (activeScreen !== 'login' && activeScreen !== 'dashboard') setActiveScreen('dashboard') }}><div className="w-2.5 h-2.5 bg-current rounded-full" /></span>
            </div>

          </div>
        </div>

        {/* Right Side: Dynamic Code Snippet Reader (7 cols) */}
        <div className="xl:col-span-7 space-y-6">
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-850">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest bg-indigo-950/50 px-2 py-0.5 rounded border border-indigo-900/50 inline-block">Active UI Component Code</span>
                <h3 className="text-base font-bold text-white font-mono mt-1">
                  {activeScreen === 'login' && 'LoginScreen.kt'}
                  {activeScreen === 'dashboard' && 'DashboardScreen.kt'}
                  {activeScreen === 'recharge' && 'RechargeScreen.kt'}
                  {activeScreen === 'wallet' && 'WalletScreen.kt'}
                </h3>
              </div>
              <button 
                onClick={handleCopyCode}
                className="text-xs font-mono text-indigo-400 hover:text-indigo-300 px-3 py-1.5 rounded bg-indigo-950/40 border border-indigo-900/50 hover:bg-indigo-950/60 cursor-pointer flex items-center gap-1.5"
              >
                {isCopied ? <Check className="h-3.5 w-3.5 text-indigo-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{isCopied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {activeScreen === 'login' && 'Authenticates cellular points of sale using standard HTTP password hashing, and supports temporal OTP inputs mapping to multi-tenant NestJS backend authentication.'}
              {activeScreen === 'dashboard' && 'Renders modern double-entry ledger cash balance cards, statistics tracking margins, and provides rapid launch pads to trigger operations.'}
              {activeScreen === 'recharge' && 'Detects operators based on mobile prefixes in real-time, executing high-speed, thread-safe asynchronous queue workers (BullMQ) on the back-end servers.'}
              {activeScreen === 'wallet' && 'Handles secure, transactional ledger transfers, ensuring double-entry balancing is validated atomically before deducting funds.'}
            </p>

            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl overflow-hidden">
              <div className="flex justify-between items-center bg-slate-900/60 border-b border-slate-800/80 px-4 py-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-500" />
                  <span className="text-[10px] font-mono text-slate-500">Kotlin / Jetpack Compose Source</span>
                </div>
              </div>
              <pre className="p-4 overflow-x-auto text-[11px] font-mono text-slate-300 leading-relaxed max-h-[380px] custom-scrollbar bg-slate-950">
                <code>{codeSnippets[activeScreen]}</code>
              </pre>
            </div>
          </div>

          {/* Quick Guide on Material Design Integration */}
          <div className="bg-slate-900/30 border border-slate-800/80 p-5 rounded-2xl flex items-start gap-4">
            <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-800/60 text-indigo-400 shrink-0">
              <Radio className="h-5 w-5 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-200">Shared Security & API Gateway</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Both the React Web App and the Android Client share the exact same NestJS authorization token signatures. Upon successful login, the mobile app holds the bearer token locally to authorize ledger debits safely over standard TLS.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
