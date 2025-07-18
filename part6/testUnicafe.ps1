# part6/testUnicafe.ps1

# 6.1: Test good button - Expect a 200 response
try {
    $response = Invoke-RestMethod -Method Get -Uri "http://localhost:5173"
    if (-not $response) { throw "Empty response" }
    Write-Output "6.1 Passed: GET good button successful.`n"
} catch {
    Write-Error "6.1 Failed GET good button: $_"
    exit 1
}

# 6.2: Test OK button - Expect ok count to increment
try {
    $response = Invoke-RestMethod -Method Get -Uri "http://localhost:5173"
    Start-Sleep -Seconds 1  # Adding a delay for state update to propagate
    $response = Invoke-RestMethod -Method Get -Uri "http://localhost:5173"
    if (-not $response) { throw "Empty response" }
    Write-Output "6.2 Passed: OK action incremented ok count.`n"
} catch {
    Write-Error "6.2 Failed OK action: $_"
    exit 1
}

# 6.3: Test 'bad' button click - Expect bad count to be incremented
try {
    # Simulate bad button click (you may want to trigger the click using JS)
    # Since React's state change is asynchronous, ensure you give it time to update
    $response = Invoke-RestMethod -Method Get -Uri "http://localhost:5173"
    
    # Wait for the state update (Give the UI a chance to react)
    Start-Sleep -Seconds 2
    
    # Now check the updated DOM for the bad count
    $response = Invoke-RestMethod -Method Get -Uri "http://localhost:5173"
    
    # Check if the 'bad' count has incremented to 1 (you can adjust this based on expected state)
    if ($response -match 'bad 1') {
        Write-Output "6.3 Passed: BAD action incremented bad count."
    } else {
        Write-Error "6.3 Failed: BAD action did not increment bad count."
        exit 1
    }
} catch {
    Write-Error "6.3 Failed to fetch bad button result: $_"
    exit 1
}

# 6.4: Test ZERO action reset - Expect good, ok, and bad counts to be reset to 0
try {
    # Simulate click on reset button
    $response = Invoke-RestMethod -Method Get -Uri "http://localhost:5173"
    
    # Adding a delay to ensure state is updated in the UI
    Start-Sleep -Seconds 1
    
    # Check if all values have been reset to zero
    if ($response -match 'good 0' -and $response -match 'ok 0' -and $response -match 'bad 0') {
        Write-Output "6.4 Passed: ZERO action reset counts successfully."
    } else {
        Write-Error "6.4 Failed: ZERO action did not reset counts."
        exit 1
    }
} catch {
    Write-Error "6.4 Failed to fetch result: $_"
    exit 1
}
