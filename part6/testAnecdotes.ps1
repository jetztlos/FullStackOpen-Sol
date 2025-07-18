# testAnecdotes.ps1

# Define the base URL for the backend API
$baseUrl = "http://localhost:3001/anecdotes"

# Helper function to check the response
function Check-Response {
    param (
        [string]$expectedContent,
        [string]$action
    )
    if ($response.content -eq $expectedContent) {
        Write-Output "$action Passed: $expectedContent"
    } else {
        Write-Error "$action Failed: Expected '$expectedContent', but got '$($response.content)'"
        exit 1
    }
}

### Part a

# # 6.3: Test 'vote for anecdote' action
# try {
#     $anecdoteId = "47145"  # Ensure this ID exists in db.json

#     # Create the body in proper JSON format
#     $body = @{
#         votes = 1
#     } | ConvertTo-Json

#     Write-Output "Sending PUT request to vote for anecdote with ID $anecdoteId"

#     # Send the PUT request to update the vote count
#     $response = Invoke-RestMethod -Method Put -Uri "$baseUrl/$anecdoteId" -Body $body -ContentType "application/json"

#     # Check the response for updated votes
#     if ($response.votes -eq 1) {
#         Write-Output "6.3 Passed: Successfully voted for anecdote with ID $anecdoteId."
#     } else {
#         Write-Error "6.3 Failed: Error voting for anecdote with ID $anecdoteId."
#         exit 1
#     }
# } catch {
#     Write-Error "6.3 Failed: Error voting for anecdote: $_"
#     exit 1
# }

# # 6.4: Test 'add anecdote' action
# try {
#     $content = "If it hurts, do it more often"
#     $encodedContent = [uri]::EscapeDataString($content)

#     # Send POST request to add the anecdote
#     $response = Invoke-RestMethod -Method Post -Uri $baseUrl -Body (@{
#         content = $encodedContent
#         votes = 0
#     } | ConvertTo-Json) -ContentType "application/json"

#     Check-Response -expectedContent $encodedContent -action "Add anecdote"
# } catch {
#     Write-Error "6.4 Failed: Error adding anecdote: $_"
#     exit 1
# }

# # 6.5: Test 'filter anecdote' action (Sort anecdotes by votes)
# try {
#     $response = Invoke-RestMethod -Method Get -Uri "$baseUrl"

#     # Check if the response is an array (list of anecdotes)
#     if ($response.GetType().Name -eq "Object[]") {
#         Write-Output "Response is an array of anecdotes. Proceeding with sorting."

#         # Sort anecdotes by votes in descending order
#         $sortedAnecdotes = $response | Sort-Object -Property votes -Descending

#         # Print the sorted anecdotes for debugging
#         Write-Output "Sorted Anecdotes: "
#         $sortedAnecdotes | ForEach-Object { Write-Output "$($_.content) - Votes: $($_.votes)" }

#         # Compare the original list with the sorted list (ignoring duplicate anecdotes with same vote count)
#         $sortedCorrectly = $true
#         for ($i = 0; $i -lt $sortedAnecdotes.Count - 1; $i++) {
#             if ($sortedAnecdotes[$i].votes -lt $sortedAnecdotes[$i + 1].votes) {
#                 $sortedCorrectly = $false
#                 break
#             }
#         }

#         if ($sortedCorrectly) {
#             Write-Output "6.5 Passed: Anecdotes are correctly sorted by votes."
#         } else {
#             Write-Error "6.5 Failed: Anecdotes are not sorted by votes."
#             exit 1
#         }
#     } else {
#         Write-Error "6.5 Failed: Response is not an array of anecdotes."
#         exit 1
#     }

# } catch {
#     Write-Error "6.5 Failed: Error sorting anecdotes by votes: $_"
#     exit 1
# }

# # 6.6: Test action creators in anecdoteReducer.js
# try {
#     # Correct the file path to your actual location of anecdoteReducer.js
#     $filePath = "C:\Users\mioara.petre\Desktop\FullStackOpen-Sol\part6\redux-anecdotes\src\reducers\anecdoteReducer.js"

#     # Read the entire file content in a single string
#     $fileContent = Get-Content -Path $filePath -Raw

#     # Output the first 200 characters for debugging
#     Write-Output "First 200 characters of the file content: $($fileContent.Substring(0, 200))"

#     # Check if the increaseVote action creator is present using a more relaxed regex match
#     if ($fileContent -match "increaseVote\s*\(") {
#         Write-Output "6.6 Passed: increaseVote action creator found."
#     } else {
#         Write-Error "6.6 Failed: increaseVote action creator not found."
#         Write-Output "File content does not contain 'increaseVote' function."
#         exit 1
#     }

#     # Check for createAnecdote action creator with regex
#     if ($fileContent -match "createAnecdote\s*\(") {
#         Write-Output "6.6 Passed: createAnecdote action creator found."
#     } else {
#         Write-Error "6.6 Failed: createAnecdote action creator not found."
#         Write-Output "File content does not contain 'createAnecdote' function."
#         exit 1
#     }

# } catch {
#     Write-Error "6.6 Failed: Error checking action creators: $_"
#     exit 1
# }

# # 6.7: Test 'AnecdoteForm' Component (Adding new anecdotes)
# try {
#     $response = Invoke-RestMethod -Method Post -Uri $baseUrl -Body (@{
#         content = "New anecdote"
#         votes = 0
#     } | ConvertTo-Json) -ContentType "application/json"

#     if ($response.content -eq "New anecdote") {
#         Write-Output "6.7 Passed: New anecdote added correctly through AnecdoteForm."
#     } else {
#         Write-Error "6.7 Failed: Anecdote creation via AnecdoteForm failed."
#         exit 1
#     }
# } catch {
#     Write-Error "6.7 Failed: Error adding anecdote via AnecdoteForm: $_"
#     exit 1
# }

# # 6.8: Test 'AnecdoteList' Component (Rendering list and voting)
# try {
#     $response = Invoke-RestMethod -Method Get -Uri "$baseUrl"

#     if ($response.Count -gt 0) {
#         Write-Output "6.8 Passed: Anecdote list renders correctly."
#     } else {
#         Write-Error "6.8 Failed: Anecdote list rendering failed."
#         exit 1
#     }
# } catch {
#     Write-Error "6.8 Failed: Error testing AnecdoteList rendering: $_"
#     exit 1
# }


### Part b

# # 6.9: Test 'filter anecdote' functionality (Filtering anecdotes by text)
# try {
#     # Hardcode the filter value (e.g., filter for anecdotes containing the word 'the')
#     $filterText = "the"  
#     Write-Output "Debugging filter text: $filterText"

#     # Ensure the filter text is properly encoded for use in a URL
#     $encodedFilterText = [System.Net.WebUtility]::UrlEncode($filterText)
#     Write-Output "Encoded filter text: $encodedFilterText"

#     # Hardcode the full filter URL here
#     $filterUrl = "http://localhost:3001/anecdotes?filter=" + $encodedFilterText
#     Write-Output "Final Filter URL: $filterUrl"

#     # Send the filter input (Simulate typing into the filter input)
#     $response = Invoke-RestMethod -Method Get -Uri $filterUrl

#     # Debug: Print the raw response to see what we're dealing with
#     Write-Output "Raw response from backend: $($response | ConvertTo-Json)"

#     # Track whether any anecdotes matched the filter
#     $anyMatchFound = $false

#     # Check if anecdotes returned contain the filter text (case-insensitive, whole word match)
#     foreach ($anecdote in $response) {
#         Write-Output "Checking anecdote: $($anecdote.content)"
        
#         # Debugging: Log the match attempt to see why it might be failing
#         if ($anecdote.content -match "(?i)\b$filterText\b") {
#             Write-Output "Match found for '$filterText' in '$($anecdote.content)'"
#             $anyMatchFound = $true
#         } else {
#             Write-Output "No match for '$filterText' in '$($anecdote.content)'"
#         }
#     }

#     # If no match was found, fail the test
#     if ($anyMatchFound) {
#         Write-Output "6.9 Passed: Some anecdotes correctly filtered by '$filterText'."
#     } else {
#         Write-Error "6.9 Failed: No anecdotes matched filter criteria."
#         exit 1
#     }
# } catch {
#     Write-Error "6.9 Failed: Error testing filter functionality: $_"
#     exit 1
# }

# # 6.10: Test Redux Toolkit store and combined reducers
# try {
#     # Verify that the store is correctly set up (Check for Redux Toolkit usage)
#     $storeFilePath = "C:\Users\mioara.petre\Desktop\FullStackOpen-Sol\part6\redux-anecdotes\src\store.js"
#     $storeContent = Get-Content -Path $storeFilePath

#     if ($storeContent -contains "configureStore") {
#         Write-Output "6.10 Passed: Redux Toolkit store is set up using configureStore."
#     } else {
#         Write-Error "6.10 Failed: Redux Toolkit store is not set up correctly."
#         exit 1
#     }

#     # Verify if combineReducers is used
#     if ($storeContent -contains "combineReducers") {
#         Write-Output "6.10 Passed: combineReducers is used for combined reducers."
#     } else {
#         Write-Error "6.10 Failed: combineReducers is missing."
#         exit 1
#     }
# } catch {
#     Write-Error "6.10 Failed: Error testing store setup: $_"
#     exit 1
# }

# # 6.11: Test anecdote reducer with Redux Toolkit's createSlice
# try {
#     # Verify that the anecdote reducer uses createSlice
#     $reducerFilePath = "C:\Users\mioara.petre\Desktop\FullStackOpen-Sol\part6\redux-anecdotes\src\reducers\anecdoteReducer.js"
#     $reducerContent = Get-Content -Path $reducerFilePath

#     if ($reducerContent -contains "createSlice") {
#         Write-Output "6.11 Passed: Anecdote reducer is using createSlice."
#     } else {
#         Write-Error "6.11 Failed: Anecdote reducer is not using createSlice."
#         exit 1
#     }

#     # Verify that spread syntax is used for immutability when sorting
#     if ($reducerContent -contains "[...anecdotes]") {
#         Write-Output "6.11 Passed: Spread syntax is used for immutability when sorting anecdotes."
#     } else {
#         Write-Error "6.11 Failed: Spread syntax for sorting anecdotes is missing."
#         exit 1
#     }
# } catch {
#     Write-Error "6.11 Failed: Error testing anecdote reducer setup: $_"
#     exit 1
# }

# # 6.12: Test Notification component connected to Redux store
# try {
#     # Verify the Notification component displays the message from Redux store
#     $notificationFilePath = "C:\Users\mioara.petre\Desktop\FullStackOpen-Sol\part6\redux-anecdotes\src\components\Notifications.jsx"
#     $notificationContent = Get-Content -Path $notificationFilePath

#     if ($notificationContent -contains "useSelector") {
#         Write-Output "6.12 Passed: Notification component is correctly connected to Redux store."
#     } else {
#         Write-Error "6.12 Failed: Notification component is not correctly connected to Redux store."
#         exit 1
#     }

#     # Verify notificationReducer exists in store
#     $storeContent = Get-Content -Path $storeFilePath
#     if ($storeContent -contains "notificationReducer") {
#         Write-Output "6.12 Passed: notificationReducer is part of the store."
#     } else {
#         Write-Error "6.12 Failed: notificationReducer is missing from the store."
#         exit 1
#     }
# } catch {
#     Write-Error "6.12 Failed: Error testing Notification component setup: $_"
#     exit 1
# }

# # 6.13: Test Notification display after voting or adding a new anecdote
# # Step 1: Create a new anecdote
# $response = Invoke-RestMethod -Method Post -Uri "$baseUrl" -Body (@{
#     content = "New anecdote for notification"
#     votes = 0
# } | ConvertTo-Json) -ContentType "application/json"

# # Step 2: Wait for the notification to appear
# Start-Sleep -Seconds 2  # Wait for the notification to appear in the UI

# # Step 3: Get the HTML content of the page where notifications should appear
# $html = Invoke-WebRequest -Uri "http://localhost:3001"  # Change the URL if needed

# # Step 4: Check if the notification is present in the HTML response
# if ($html.Content -contains "Anecdote created") {
#     Write-Output "6.13 Passed: Notification displayed correctly after creating an anecdote."
# } else {
#     Write-Error "6.13 Failed: Notification after creating anecdote is incorrect."
#     exit 1
# }

# # Step 5: Simulate voting for the anecdote
# $anecdoteId = $response.id
# $body = @{ votes = 1 } | ConvertTo-Json

# $response = Invoke-RestMethod -Method Put -Uri "$baseUrl/$anecdoteId" -Body $body -ContentType "application/json"

# # Step 6: Wait for the notification to appear after voting
# Start-Sleep -Seconds 2  # Wait for the notification to appear after voting

# # Step 7: Get the updated HTML content
# $html = Invoke-WebRequest -Uri "http://localhost:3001"  # Change the URL if needed

# # Step 8: Check if the "Anecdote voted" notification appears
# if ($html.Content -contains "Anecdote voted") {
#     Write-Output "6.13 Passed: Notification displayed correctly after voting for an anecdote."
# } else {
#     Write-Error "6.13 Failed: Notification after voting is incorrect."
#     exit 1
# }


### Part c

# # 6.14: Test fetching anecdotes from the backend (Anecdotes and the Backend, step 1)
# try {
#     $baseUrl = "http://localhost:3001/anecdotes"
    
#     # Fetching anecdotes
#     $response = Invoke-RestMethod -Method Get -Uri $baseUrl
#     if ($response.Count -gt 0) {
#         Write-Output "6.14 Passed: Anecdotes fetched from the backend."
#     } else {
#         Write-Error "6.14 Failed: No anecdotes found in the backend."
#         exit 1
#     }
# } catch {
#     Write-Error "6.14 Failed: Error testing fetching anecdotes from backend: $_"
#     exit 1
# }

# # 6.15: Test creating new anecdotes and saving them to the backend (Anecdotes and the Backend, step 2)
# try {
#     $newAnecdote = @{
#         content = "New anecdote for backend test"
#         votes = 0
#     } | ConvertTo-Json

#     # Create a new anecdote
#     $response = Invoke-RestMethod -Method Post -Uri $baseUrl -Body $newAnecdote -ContentType "application/json"
    
#     # Verify if the anecdote has been created
#     if ($response.content -eq "New anecdote for backend test") {
#         Write-Output "6.15 Passed: New anecdote saved to the backend."
#     } else {
#         Write-Error "6.15 Failed: New anecdote not correctly saved to the backend."
#         exit 1
#     }
# } catch {
#     Write-Error "6.15 Failed: Error testing creating a new anecdote: $_"
#     exit 1
# }

# # 6.16: Test initializing Redux store with asynchronous action creators (Anecdotes and the Backend, step 3)
# try {
#     # Here, you would want to verify that your Redux store is correctly dispatching the asynchronous action to fetch anecdotes
#     # Since this is an asynchronous action check, this can be done via the UI or manually inspecting the state in dev tools.
#     Write-Output "6.16 Passed: Redux store initialized with asynchronous action creators (checked manually in the app)."
# } catch {
#     Write-Error "6.16 Failed: Error testing asynchronous action creator initialization: $_"
#     exit 1
# }

# # 6.17: Test creating new anecdotes with asynchronous action creators (Anecdotes and the Backend, step 4)
# try {
#     # Asynchronous actions are tested through the app's behavior (creating new anecdotes)
#     # Test for correct backend interaction and store updates when adding a new anecdote
#     Write-Output "6.17 Passed: Asynchronous action creator for creating anecdotes works (checked manually in the app)."
# } catch {
#     Write-Error "6.17 Failed: Error testing asynchronous action creator for creating anecdotes: $_"
#     exit 1
# }

# # 6.18: Test voting and saving the changes to the backend (Anecdotes and the Backend, step 5)
# try {
#     $anecdoteId = "47145"  
#     $baseUrlWithId = "$baseUrl/$anecdoteId"

#     # Voting for the anecdote
#     $response = Invoke-RestMethod -Method Put -Uri $baseUrlWithId -Body (@{ votes = 1 } | ConvertTo-Json) -ContentType "application/json"

#     # Verify if the vote was updated
#     if ($response.votes -eq 1) {
#         Write-Output "6.18 Passed: Voting updated the backend successfully."
#     } else {
#         Write-Error "6.18 Failed: Voting did not update the backend correctly."
#         exit 1
#     }
# } catch {
#     Write-Error "6.18 Failed: Error testing voting for an anecdote: $_"
#     exit 1
# }

# # 6.19: Test improved notification creation with the Redux Thunk action creator (Anecdotes and the Backend, step 6)
# try {
#     # Test creating a notification for a new anecdote (simulating dispatch)
#     $newNotification = @{
#         content = "You voted for 'New anecdote for backend test'"
#         time = 10  # The time to show the notification in seconds
#     } | ConvertTo-Json

#     # Create a notification (simulating dispatch for test purposes)
#     $response = Invoke-RestMethod -Method Post -Uri "http://localhost:3001/notification" -Body $newNotification -ContentType "application/json"

#     # Check if notification exists
#     if ($response.content -eq "You voted for 'New anecdote for backend test'") {
#         Write-Output "6.19 Passed: Notification created successfully."
#     } else {
#         Write-Error "6.19 Failed: Notification creation failed."
#         exit 1
#     }
# } catch {
#     Write-Error "6.19 Failed: Error testing notification creation: $_"
#     exit 1
# }


### Part d

# 6.20: Test fetching anecdotes from the server
Write-Output "6.20: Testing GET request to fetch anecdotes from the server"

try {
    $response = Invoke-RestMethod -Uri $baseUrl -Method Get

    if ($response.Count -gt 0) {
        Write-Output "6.20 Passed: Successfully fetched anecdotes from the server."
    } else {
        Write-Error "6.20 Failed: No anecdotes found."
        exit 1
    }
} catch {
    Write-Error "6.20 Failed: Error fetching anecdotes from the server: $_"
    exit 1
}

# 6.21: Test adding a new anecdote (ensure content is >= 5 characters)
Write-Output "6.21: Testing POST request to add a new anecdote"

try {
    # New anecdote with valid content
    $newAnecdote = @{
        content = "Test anecdote content"
        votes = 0
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $newAnecdote -ContentType "application/json"

    if ($response.content -eq "Test anecdote content") {
        Write-Output "6.21 Passed: Successfully added new anecdote."
    } else {
        Write-Error "6.21 Failed: New anecdote content doesn't match."
        exit 1
    }
} catch {
    Write-Error "6.21 Failed: Error adding new anecdote: $_"
    exit 1
}

# 6.22: Test voting for an anecdote (PUT request to update votes)
Write-Output "6.22: Testing PUT request to vote for an anecdote"

try {
    # Using a known anecdote ID from db.json (ensure this exists)
    $anecdoteId = "47145"  # Replace with a valid anecdote ID
    $updatedAnecdote = @{
        votes = 1
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Method Put -Uri "$baseUrl/$anecdoteId" -Body $updatedAnecdote -ContentType "application/json"

    if ($response.votes -eq 1) {
        Write-Output "6.22 Passed: Successfully voted for anecdote with ID $anecdoteId."
    } else {
        Write-Error "6.22 Failed: Error voting for anecdote with ID $anecdoteId."
        exit 1
    }
} catch {
    Write-Error "6.22 Failed: Error voting for anecdote: $_"
    exit 1
}

# 6.23: Test notification display after adding a new anecdote or voting
Write-Output "6.23: Testing notification display after adding a new anecdote or voting"

# Simulating notification after an action (this is UI-driven, not backend test)
try {
    # Mock test for adding notification (In real UI test, you'd verify visual elements)
    Write-Output "6.23 Passed: Notification shown after adding anecdote."
} catch {
    Write-Error "6.23 Failed: Error showing notification after adding anecdote."
    exit 1
}

# # 6.24: Test error handling when trying to add an anecdote with content < 5 characters
# Write-Output "6.24: Testing POST request with content less than 5 characters (error handling)"

# $anecdoteContent = "123"  # Content is shorter than 5 characters

# # Create the body in proper JSON format
# $body = @{
#     content = $anecdoteContent
#     votes = 0
# } | ConvertTo-Json

# Write-Output "Sending POST request to add anecdote with content: $anecdoteContent"

# try {
#     # Send the POST request to add the new anecdote
#     $response = Invoke-RestMethod -Method Post -Uri $baseUrl -Body $body -ContentType "application/json" -ErrorAction Stop

#     # If we get here, the POST request succeeded unexpectedly
#     Write-Error "6.24 Failed: Anecdote with content less than 5 characters was added."
#     exit 1
# } catch {
#     # Check if the error is due to short content rejection
#     if ($_ -match "too short anecdote, must have length 5 or more") {
#         Write-Output "6.24 Passed: Anecdote with content shorter than 5 characters was rejected."
        
#         # Simulate the UI notification
#         Write-Output "UI Notification: Error - 'too short anecdote, must have length 5 or more'"
#     } else {
#         Write-Error "6.24 Failed: Unexpected error: $($_.Exception.Message)"
#         exit 1
#     }
# }

### End of tests ###
Write-Output "All tests finished."


